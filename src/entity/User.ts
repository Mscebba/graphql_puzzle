import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Recipe } from './recipe';

@ObjectType()
@Entity('user')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Field(() => [Recipe])
  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

@ObjectType()
export class LoginToken {
  @Field()
  token: string;
}
