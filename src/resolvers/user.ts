import {
  Resolver,
  Mutation,
  Arg,
  Field,
  // Query,
  Ctx,
  UseMiddleware,
  InputType,
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { User, LoginToken } from '../entity/user';
import { AppContext } from '../helper/context';
import { createToken } from '../middleware/auth';
import { isAuth } from '../middleware/isauth';

@InputType()
class NewUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;
}

@Resolver()
export class UserResolver {
  // @Query(() => [User])
  // @UseMiddleware(isAuth)
  // async getUsers() {
  //   return await User.find();
  // }

  // Create a new User
  @Mutation(() => User)
  async signUp(@Arg('input') input: NewUserInput): Promise<User> {
    const hashedPassword = await hash(input.password, 12);
    input.password = hashedPassword;
    const user = await User.create({ ...input }).save();
    return user;
  }

  // User login
  @Mutation(() => LoginToken, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() {}: AppContext
  ): Promise<LoginToken> {
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

  // Update your own User
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUser(
    @Ctx() { payload }: AppContext,
    @Arg('input') input: UpdateUserInput
  ): Promise<User> {
    const user = await User.findOne({ email: payload.email });
    if (user?.email !== payload.email) {
      throw new Error("You can't edit another user");
    }
    if (input.password) {
      const hashedPassword = await hash(input.password!, 12);
      input.password = hashedPassword;
    }

    Object.assign(user, input);
    await user.save();

    return user;
  }

  // Delete your own User
  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async deleteMyUser(@Ctx() { payload }: AppContext): Promise<Boolean | null> {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('User not found or already deleted');
    await user.remove();
    return true;
  }
}
