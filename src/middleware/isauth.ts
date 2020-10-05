import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { AppContext } from '../helper/context';

export const isAuth: MiddlewareFn<AppContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error('Not authenticated');
  }

  try {
    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET_KEY || 'secret@236790';
    const payload = verify(token, secret);
    context.payload = payload as any;
  } catch (error) {
    throw new Error('Not authenticated');
  }
  return next();
};
