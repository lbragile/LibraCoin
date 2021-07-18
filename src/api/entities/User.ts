import { Field, Float, ID, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from "typeorm";

@Entity()
@Unique("UniqueUser", ["publicKey", "privateKey"])
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "numeric" })
  @Field(() => Float, { defaultValue: 1000.0, description: "The user's remaining LibraCoin balance" })
  balance: number;

  @Column({ length: "182" })
  @Field(() => ID, {
    defaultValue: "",
    description: "The user's public key → which together with the private key, allows them to send & receive LibraCoins"
  })
  publicKey: string;

  @Column({ length: "276" })
  privateKey: string;
}
