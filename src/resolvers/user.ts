import { hash, compare } from 'bcryptjs';
import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';

import { User, LoginToken } from '../entity/user';
import { AppContext } from '../helper/context';
import { createToken } from '../middleware/auth';
import { isAuth } from '../middleware/isauth';
import { NewUserInput, UpdateUserInput } from './userInput';

@Resolver()
export class UserResolver {
  //
  // Create a new User ///////////////////////
  //
  @Mutation(() => User)
  async signUp(@Arg('input') input: NewUserInput): Promise<User> {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) throw new Error('Email is already in use');
    const hashedPassword = await hash(input.password, 12);
    input.password = hashedPassword;
    const user = await User.create({ ...input }).save();
    return user;
  }

  //
  // User login ///////////////////////
  //
  @Mutation(() => LoginToken, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() {}: AppContext
  ): Promise<LoginToken | null> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = createToken(user);

    return { token };
  }

  //
  // Update your own User ///////////////////////
  //
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUser(
    @Ctx() { payload }: AppContext,
    @Arg('input') input: UpdateUserInput
  ): Promise<User> {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('Not authenticated');
    if (user.email !== payload.email) {
      throw new Error("You can't edit another user");
    }
    if (input.password) {
      const hashedPassword = await hash(input.password!, 12);
      input.password = hashedPassword;
    }

    await Object.assign(user, input).save();

    return user;
  }

  //
  // Delete your own User ///////////////////////
  //
  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async deleteMyUser(@Ctx() { payload }: AppContext): Promise<Boolean | null> {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('User not found or already deleted');
    await user.remove();
    return true;
  }
}
