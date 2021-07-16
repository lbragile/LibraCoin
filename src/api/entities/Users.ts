import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  publicKey!: string;

  @Column()
  privateKey!: string;

  @Column()
  balance!: number;
}
