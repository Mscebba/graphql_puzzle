import { Resolver, Query, Mutation, Arg } from 'type-graphql';

import { Category } from '../entity/category';

@Resolver()
export class CategoryResolver {
  // Get the list of Categories
  @Query(() => [Category])
  async getCategories(): Promise<Category[] | null> {
    return await Category.find();
  }

  // Get one Category by ID
  @Query(() => Category, { nullable: true })
  async getOneCategory(
    @Arg('id', () => String) id: string
  ): Promise<Category | null> {
    const category = await Category.findOne({ id });
    if (!category) throw Error('Invalid ID.');
    return category;
  }

  // Create a new Category
  @Mutation(() => Category)
  async createCategory(@Arg('name') name: string): Promise<Category> {
    const category = await Category.create({
      name,
    }).save();

    return category;
  }

  // Update existing category
  @Mutation(() => Category)
  async updateCategory(
    @Arg('id') id: string,
    @Arg('name') name: string
  ): Promise<Category> {
    const category = await Category.findOne({ id });
    if (!category) throw Error('Invalid Category ID.');
    category.name = name;
    await category.save();
    return category;
  }

  // Delete category
  @Mutation(() => Boolean, { nullable: true })
  async deleteCategory(
    @Arg('id', () => String) id: string
  ): Promise<Boolean | null> {
    const category = await Category.findOne({ id });
    if (!category) throw Error('Invalid Category ID.');
    await category.remove();
    return true;
  }
}
