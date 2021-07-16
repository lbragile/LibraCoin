import "reflect-metadata";
import { Arg, buildSchema, Field, ID, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { createConnection, getConnectionOptions } from "typeorm";
import path from "path";
import { config as configEnv } from "dotenv";
import dotEnvExpand from "dotenv-expand";

if (process.env.NODE_ENV !== "production") {
  const env = configEnv({ path: path.resolve(__dirname, "../../.env.local") });
  dotEnvExpand(env);
}

const db = [
  { id: "aaa", name: "bob" },
  { id: "bbb", name: "bill" },
  { id: "ccc", name: "barbra" },
  { id: "ddd", name: "ben" },
  { id: "eee", name: "bart" }
];

@ObjectType()
class TestGraphQL {
  @Field(() => ID, { description: "this is the id" })
  id!: string;

  @Field({ description: "name is important", nullable: true })
  name?: string;
}

@Resolver(TestGraphQL)
class TestGraphQLResolver {
  @Query(() => [TestGraphQL])
  async getName() {
    return db;
  }

  @Mutation(() => [TestGraphQL])
  async changeFirstName(@Arg("id") id: string) {
    return db.map((item) => {
      if (item.id === id) {
        item.name = "NEW NAME";
      }
      return item;
    });
  }
}

async function main() {
  const connectionOptions = await getConnectionOptions();
  await createConnection(connectionOptions);

  const schema = await buildSchema({
    resolvers: [TestGraphQLResolver],
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
