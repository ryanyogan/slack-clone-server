import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';

import { validateUser } from './lib/middleware';
import models from './models';
import { SECRET, SECRET_2 } from './config/constants';

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, './graphql/schema')),
);

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './graphql/resolvers')),
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlEndpoint = '/graphql';
const app = express();

app.use(cors('*'));

app.use(validateUser);

app.use(
  graphqlEndpoint,
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      SECRET,
      SECRET_2,
    },
  })),
);

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));

models.sequelize.sync({  }).then(() => app.listen(8080));
