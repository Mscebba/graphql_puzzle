import { sign } from 'jsonwebtoken';
import { User } from '../entity/user';

const secret = process.env.JWT_SECRET_KEY || 'secret@236790';

export const createToken = (user: User) => {
  return sign({ email: user.email }, secret, { expiresIn: '1d' });
};
