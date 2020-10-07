import { InputType, Field } from 'type-graphql';

@InputType()
export class NewRecipeInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  ingredients: string;

  @Field({ nullable: true })
  categoryId: string;
}

@InputType()
export class UpdateRecipeInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ingredients?: string;

  @Field({ nullable: true })
  categoryId?: string;
}

@InputType()
export class searchRecipesByFields {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ingredients?: string;
}
