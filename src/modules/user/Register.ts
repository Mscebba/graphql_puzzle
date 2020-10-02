import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async getUsers() {
    return 'Users';
  }

  @Mutation(() => User)
  async register(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
