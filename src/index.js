import Koa from 'koa';
const cors = require('@koa/cors');
import KoaRouter from 'koa-router';
import koaLogger from 'koa-logger';
import mount from 'koa-mount'
import koaBody from 'koa-bodyparser';
import koaCors from '@koa/cors';

import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa';
import graphQLSchema from './graphQLSchema';

import { formatErr } from './utilities';

// let routerStorage = require('./Imagine/imagine_storage_ms/router.js')
import routerStorage from './Imagine/imagine_storage_ms/router'

const app = new Koa();
app.use(cors());
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async(ctx, next) => {
  if (ctx.header.authorization) {
    const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
    if (token && token[1]) {
      ctx.state.token = token[1];
    }
  }
  await next();
});

// GraphQL
const graphql = graphqlKoa((ctx) => ({
  schema: graphQLSchema,
  context: { token: ctx.state.token },
  formatError: formatErr
}));

router.post('/graphql', koaBody(), graphql);
router.get('/graphql', graphql);

// test route
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(mount('/ag/storage', routerStorage()))
app.use(router.routes());
// app.use('/api/storage', routerStorage);
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));