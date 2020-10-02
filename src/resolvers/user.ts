import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../entity/user';

@Resolver()
export class UserResolver {
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

  @Mutation(() => String, { nullable: true })
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    return 'Login successfully';
  }
}
