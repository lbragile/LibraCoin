import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { getComplexity, fieldExtensionsEstimator, simpleEstimator } from "graphql-query-complexity";
import { createConnection, getConnectionOptions } from "typeorm";

import path from "path";
import { config as configEnv } from "dotenv";
import dotEnvExpand from "dotenv-expand";

if (process.env.NODE_ENV !== "production") {
  const env = configEnv({ path: path.resolve(__dirname, "../../.env.local") });
  dotEnvExpand(env);
}

async function main() {
  const connectionOptions = await getConnectionOptions();
  await createConnection(connectionOptions);

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "/resolvers/*.ts")],
    emitSchemaFile: {
      path: path.resolve(__dirname, "../graphql/generated/schema.gql"),
      commentDescriptions: true,
      sortedSchema: false // by default the printed schema is sorted alphabetically
    }
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    engine: { reportSchema: true },
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            // adjust according to 2 * (largest complexity in front end)
            const MAX_COMPLEXITY = 8;

            // fieldExtensionsEstimator is mandatory for TypeGraphQL
            const estimators = [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })];

            // check only the requested operation not the whole document that may contains multiple operations
            // based on schema, GraphQL query document, and variables
            const { operationName, variables } = request;
            const complexity = getComplexity({ schema, operationName, query: document, variables, estimators });

            if (complexity > MAX_COMPLEXITY) {
              const errMsg = `Sorry, the supplied query is too complicated! received: ${complexity}, max: ${MAX_COMPLEXITY}.`;
              throw new Error(errMsg);
            } else if (complexity > 0) {
              console.log("Received query complexity:", complexity);
            }
          }
        })
      }
    ]
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server started at ${url.slice(0, -1)}/graphql`);
}

main();
