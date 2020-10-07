import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql';

import { Category } from '../entity/category';
import { isAuth } from '../middleware/isauth';

@Resolver()
export class CategoryResolver {
  //
  // Get the list of Categories ///////////////////////
  //
  @Query(() => [Category], { nullable: true })
  @UseMiddleware(isAuth)
  async getCategories(): Promise<Category[] | null> {
    const category = await Category.find({
      relations: ['recipes'],
    });

    return category;
  }

  //
  // Get one Category by ID ///////////////////////
  //
  @Query(() => Category, { nullable: true })
  @UseMiddleware(isAuth)
  async getOneCategory(
    @Arg('id', () => String) id: string
  ): Promise<Category | null> {
    const category = await Category.findOne({
      where: { id },
      relations: ['recipes'],
    });
    if (!category) throw Error('Invalid category Id.');
    return category;
  }

  //
  // Create a new Category ///////////////////////
  //
  @Mutation(() => Category)
  @UseMiddleware(isAuth)
  async createCategory(@Arg('name') name: string): Promise<Category> {
    const category = await Category.create({ name }).save();

    return category;
  }

  //
  // Update existing category ///////////////////////
  //
  @Mutation(() => Category)
  @UseMiddleware(isAuth)
  async updateCategory(
    @Arg('id') id: string,
    @Arg('name') name: string
  ): Promise<Category> {
    const category = await Category.findOne({ id });
    if (!category) throw Error('Invalid category Id.');
    await Object.assign(category, { name }).save();
    return category;
  }

  //
  // Delete category ///////////////////////
  //
  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async deleteCategory(
    @Arg('id', () => String) id: string
  ): Promise<Boolean | null> {
    const category = await Category.findOne({ id });
    if (!category) throw Error('Invalid category Id.');
    await category.remove();
    return true;
  }
}
