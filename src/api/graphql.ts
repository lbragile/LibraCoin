import "reflect-metadata";
import { Arg, buildSchema, Field, ID, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { ApolloServer } from "apollo-server";

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
  const schema = await buildSchema({
    resolvers: [TestGraphQLResolver],
    emitSchemaFile: {
      path: __dirname + "/generated/schema.gql",
      commentDescriptions: true,
      sortedSchema: false // by default the printed schema is sorted alphabetically
    }
  });

  // Create the GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server started at ${url}graphql`);
}

main();
