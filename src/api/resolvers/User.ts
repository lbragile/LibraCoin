import { Query, Mutation, Arg, Resolver, Field, ObjectType } from "type-graphql";
import { getManager } from "typeorm";
import { User } from "../entities/User";

@ObjectType()
class UserWithSK extends User {
  @Field({
    defaultValue: "",
    description: "The user's private (secret) key → used for signing and verifying transactions"
  })
  privateKey!: string;
}

@Resolver(User)
export class UsersResolver {
  @Query(() => User)
  async userDetails(@Arg("publicKey") publicKey: string): Promise<User | undefined> {
    const manager = getManager();
    return await manager.findOne(User, { publicKey });
  }

  @Mutation(() => UserWithSK)
  async createUser(@Arg("publicKey") publicKey: string, @Arg("privateKey") privateKey: string): Promise<User> {
    const manager = getManager();

    // create a user instance
    const user = manager.create(User, { balance: 1000.0, publicKey, privateKey });

    // add instance to database (update if exists)
    await manager.save(user);
    return user;
  }
}
