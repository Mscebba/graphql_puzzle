import 'dotenv/config';
import 'reflect-metadata';
import Express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { UserResolver } from './resolvers/user';
import { CategoryResolver } from './resolvers/category';
import { RecipeResolver } from './resolvers/recipe';

const Server = async () => {
  const connection = await createConnection();
  await connection.synchronize();

  const schema = await buildSchema({
    resolvers: [UserResolver, CategoryResolver, RecipeResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 4001;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

Server();
