import { getRepository } from 'typeorm';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
} from 'type-graphql';

import { AppContext } from '../helper/context';
import { isAuth } from '../middleware/isauth';
import { Recipe } from '../entity/recipe';
import { User } from '../entity/user';
import { Category } from '../entity/category';
import {
  NewRecipeInput,
  UpdateRecipeInput,
  searchRecipesByFields,
} from './recipeinput';

@Resolver()
export class RecipeResolver {
  //
  // Create a new recipe ///////////////////////
  //
  @Mutation(() => Recipe)
  @UseMiddleware(isAuth)
  async createRecipe(
    @Ctx() { payload }: AppContext,
    @Arg('input') input: NewRecipeInput
  ): Promise<Recipe> {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('User not found');

    const category = await Category.findOne({ id: input.categoryId });
    if (!category) throw new Error('Invalid category id');
    input.categoryId = category.id;

    const recipe = await Recipe.create({
      ...input,
      author: user.email,
      user,
      category,
    }).save();

    return recipe;
  }

  //
  // Get the list of recipes ///////////////////////
  //
  @Query(() => [Recipe], { nullable: true })
  @UseMiddleware(isAuth)
  async getRecipes(): Promise<Recipe[] | null> {
    const recipe = await Recipe.find({
      relations: ['user', 'category'],
    });

    return recipe;
  }

  //
  // Get one recipe by ID ///////////////////////
  //
  @Query(() => Recipe, { nullable: true })
  @UseMiddleware(isAuth)
  async getOneRecipe(
    @Arg('id', () => String) id: string
  ): Promise<Recipe | null> {
    const recipe = await Recipe.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
    if (!recipe) throw Error('Invalid recipe Id.');
    return recipe;
  }

  //
  // Get my recipes ///////////////////////
  //
  @Query(() => [Recipe], { nullable: true })
  @UseMiddleware(isAuth)
  async getMyRecipes(@Ctx() { payload }: AppContext): Promise<Recipe[] | null> {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('User not found');

    const recipes = await Recipe.find({
      where: { author: user.email },
      relations: ['user', 'category'],
    });

    return recipes;
  }

  //
  // Get recipes by Field search ///////////////////////
  //
  @Query(() => [Recipe], { nullable: true })
  @UseMiddleware(isAuth)
  async getRecipesByFieldSearch(@Arg('input') input: searchRecipesByFields) {
    const { name, description, ingredients } = input;

    const recipe = await getRepository(Recipe)
      .createQueryBuilder()
      .where('name ILIKE :name', { name: `%${name}%` })
      .orWhere('description ILIKE :description', {
        description: `%${description}%`,
      })
      .orWhere('ingredients ILIKE :ingredients', {
        ingredients: `%${ingredients}%`,
      })
      .getMany();

    return recipe;
  }

  //
  // Update existing recipe ///////////////////////
  //
  @Mutation(() => Recipe, { nullable: true })
  @UseMiddleware(isAuth)
  async updateRecipe(
    @Ctx() { payload }: AppContext,
    @Arg('input') input: UpdateRecipeInput
  ): Promise<Recipe | null> {
    const recipe = await Recipe.findOne(input.id);
    if (!recipe) throw Error('Invalid recipe Id');

    const category = await Category.findOne(input.categoryId);
    if (!category) throw new Error('Invalid category Id');

    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('Not authenticated');

    if (recipe.author !== user.email) {
      throw Error('You are not the author of this recipe');
    }
    await Object.assign(recipe, { input, category }).save();
    return recipe;
  }

  //
  // Delete recipe ///////////////////////
  //
  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async deleteRecipe(
    @Ctx() { payload }: AppContext,
    @Arg('id', () => String) id: string
  ): Promise<Boolean | null> {
    const recipe = await Recipe.findOne(id);
    if (!recipe) throw Error('Invalid recipe Id');

    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('Not authenticated');

    if (recipe.author !== user.email) {
      throw Error('You are not the author of this recipe');
    }
    await recipe.remove();
    return true;
  }
}
