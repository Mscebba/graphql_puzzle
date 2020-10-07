import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { UserResolver } from './resolvers/user';
import { CategoryResolver } from './resolvers/category';
import { RecipeResolver } from './resolvers/recipe';

export async function Server() {
  const app = express();
  app.use(express.json());

  app.use(cors());

  const schema = await buildSchema({
    resolvers: [UserResolver, CategoryResolver, RecipeResolver],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  server.applyMiddleware({ app, path: '/graphql' });

  return app;
}
