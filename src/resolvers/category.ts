import { Resolver, Query, Mutation, Arg } from 'type-graphql';

import { Category } from '../entity/category';

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  getCategories() {
    return Category.find();
  }

  @Mutation(() => Category)
  async createCategory(@Arg('name') name: string): Promise<Category> {
    const category = await Category.create({
      name,
    }).save();

    return category;
  }
}
