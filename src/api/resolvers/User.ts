import { Query, Mutation, Arg, Resolver, Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";

@ObjectType()
class UserWithSK extends User {
  @Field({
    defaultValue: "",
    description: "The user's private (secret) key → used for signing and verifying transactions"
  })
  privateKey: string;
}

@Resolver(User)
export class UsersResolver {
  @Query(() => User, {
    nullable: true,
    complexity: 3,
    description: "Returns a user's details based on their public key. The private key is not visible."
  })
  async userDetails(@Arg("publicKey") publicKey: string): Promise<User | undefined> {
    return User.findOne({ publicKey });
  }

  @Mutation(() => UserWithSK, {
    complexity: 4,
    description: "If a user does not exist with the given public and private key combination, add them to the database."
  })
  async createUser(@Arg("publicKey") publicKey: string, @Arg("privateKey") privateKey: string): Promise<User> {
    return User.create({ balance: 1000.0, publicKey, privateKey }).save();
  }
}
