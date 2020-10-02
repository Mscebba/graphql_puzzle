import 'reflect-metadata';
import Express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import dotEnv from 'dotenv';
import { createConnection } from 'typeorm';

import { RegisterResolver } from './modules/user/register';

const Server = async () => {
  const connection = await createConnection();
  await connection.synchronize();

  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });

  dotEnv.config();

  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 4001;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

Server();
