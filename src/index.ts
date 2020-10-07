import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Server } from './server';

async function main() {
  const connection = await createConnection();
  await connection.synchronize();

  const app = await Server();

  const PORT = process.env.PORT || 4001;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
}

main();
