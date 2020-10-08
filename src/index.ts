import 'dotenv/config';
import 'reflect-metadata';
import { Server } from './server';
import { connection } from './config/ormconfig';

async function main() {
  connection();

  const app = await Server();

  const PORT = process.env.PORT || 4001;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
}

main();
