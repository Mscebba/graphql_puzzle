import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user';
import { Category } from './category';

@ObjectType()
@Entity('recipe')
export class Recipe extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column('text')
  ingredients: string;

  @Field()
  @Column('text')
  author: string;

  @Field(() => ID)
  @Column()
  categoryId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.recipes)
  category: Category;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
