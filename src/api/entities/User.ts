import { Field, Float, ID, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "numeric" })
  @Field(() => Float, { description: "The user's remaining LibraCoin balance" })
  balance!: number;

  @Column({ length: "182" })
  @Field(() => ID, {
    description: "The user's public key → which together with the private key, allows them to send & receive LibraCoins"
  })
  publicKey!: string;

  @Column({ length: "276" })
  privateKey!: string;
}
