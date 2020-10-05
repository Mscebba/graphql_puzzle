import {
  Resolver,
  Mutation,
  Arg,
  Field,
  ArgsType,
  Args,
  Query,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { User, LoginToken } from '../entity/user';
import { AppContext } from 'src/helper/context';
import { createToken } from '../middleware/auth';
import { isAuth } from '../middleware/isauth';

@ArgsType()
class NewUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getUsers() {
    return await User.find();
  }

  // Create a new User
  @Mutation(() => User)
  async signUp(@Args() { name, email, password }: NewUserInput): Promise<User> {
    const hashedPassword = await hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }

  // Use login
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
}
