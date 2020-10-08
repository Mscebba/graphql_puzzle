import path from 'path';
import { createConnection } from 'typeorm';

const type = process.env.TYPEORM_TYPE || 'postgres';
const username = process.env.TYPEORM_USERNAME || 'user';
const password = process.env.TYPEORM_PASSWORD || 'pass';
const host = process.env.TYPEORM_HOST || 'db';
const port = 5432;
const database = process.env.TYPEORM_DATABASE || 'data';

export async function connection() {
  await createConnection({
    type: 'postgres',
    url:
      process.env.DATABASE_URL ||
      `${type}://${username}:${password}@${host}:${port}/${database}`,
    entities: [
      path.join(__dirname, '../entity/**.ts'),
      path.join(__dirname, '../entity/**.js'),
    ],
    synchronize: true,
  });
  console.log('DB connected');
}
