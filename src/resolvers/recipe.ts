import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  ArgsType,
  Args,
} from 'type-graphql';

import { Recipe } from '../entity/recipe';

@ArgsType()
class NewRecipeInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  ingredients: string[];
}

@ArgsType()
class UpdateRecipeInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  ingredients?: string[];
}

@Resolver()
export class RecipeResolver {
  // Get the list of recipes
  @Query(() => [Recipe], { nullable: true })
  async getRecipes(): Promise<Recipe[] | null> {
    return await Recipe.find();
  }

  // Get one recipe by ID
  @Query(() => Recipe, { nullable: true })
  async getOneRecipe(
    @Arg('id', () => String) id: string
  ): Promise<Recipe | null> {
    const recipe = await Recipe.findOne({ id });
    if (!recipe) throw Error('Invalid ID.');
    return recipe;
  }

  // Create a new recipe
  @Mutation(() => Recipe)
  async createRecipe(
    @Args() { name, description, ingredients }: NewRecipeInput
  ): Promise<Recipe> {
    const recipe = await Recipe.create({
      name,
      description,
      ingredients,
    }).save();

    return recipe;
  }

  // Update existing recipe
  @Mutation(() => Recipe)
  async updateRecipe(
    @Args() { id, name, description, ingredients }: UpdateRecipeInput
  ): Promise<Recipe> {
    const recipe = await Recipe.findOne({ id });
    const updatedRecipe = { name, description, ingredients };
    if (!recipe) throw Error('Invalid Recipe ID');
    await Object.assign(recipe, updatedRecipe).save();
    return recipe;
  }

  // Delete recipe
  @Mutation(() => Boolean, { nullable: true })
  async deleteRecipe(
    @Arg('id', () => String) id: string
  ): Promise<Boolean | null> {
    const recipe = await Recipe.findOne({ id });
    if (!recipe) throw Error('Invalid Recipe ID');
    await recipe.remove();
    return true;
  }
}
