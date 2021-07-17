import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
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
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server started at ${url.slice(0, -1)}/graphql`);
}

main();
