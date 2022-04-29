'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
  console.log('sad', url);
  const parameters = {
    method,
    uri: encodeURI(url),
    body,
    json: true,
    resolveWithFullResponse: fullResponse,
  };
  if (process.env.SHOW_URLS) {
    // eslint-disable-next-line
    console.log(url);
  }

  try {
    return await request(parameters)
  } catch (err) {
    return err
  }
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
  let queryUrl = `${url}?`;
  for (let param in parameters) {
    // check object properties
    if (
      Object.prototype.hasOwnProperty.call(parameters, param) &&
      parameters[param]
    ) {
      if (Array.isArray(parameters[param])) {
        queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
      } else {
        queryUrl += `${param}=${parameters[param]}&`;
      }
    }
  }
  return queryUrl
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
  const queryUrl = addParams(`${url}/${path}`, parameters);
  return generalRequest(queryUrl, 'GET')
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
  return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`
}

function formatErr(error) {
  const data = graphql.formatError(error);
  const { originalError } = error;
  if (originalError && originalError.error) {
    const { path } = data;
    const {
      error: { id: message, code, description },
    } = originalError;
    return { message, code, description, path }
  }
  return data
}

const commentTypeDef = `
  type Comment{
    imageID: String
    message: String
  }
  type Res{
    ok: Boolean
    comments: [Comment]
    comment : Comment,
    msg: String
  }
  input commentInput{
    idc: String!
    message: String!
  }`;

const commentQueries = `
<<<<<<< HEAD
  commentsByImageId(imageID: String!): Res!
=======
  commentsByImageId(imageID: String): Comment
>>>>>>> a42c94bc2f5a4f17dd6b8e6f32532bfb0578c9a3
`;

const commentMutations = `
  createComment(imageID: String!, message: String!): Res!
  updateComment(idc: String!, newMessage: String!): Res!
  deleteComment(idc: String!): Res!
`;

const categoryTypeDef = `
  type Category {
      id: Int!
      name: String!
  }
  input CategoryInput {
      name: String!
      description: String!
  }`;

const categoryQueries = `
      allCategories: [Category]!
      categoryById(id: Int!): Category!
  `;

const categoryMutations = `
    createCategory(category: CategoryInput!): Category!
    updateCategory(id: Int!, category: CategoryInput!): Category!
    deleteCategory(id: Int!): Int
`;

<<<<<<< HEAD
=======
//change this line
>>>>>>> a42c94bc2f5a4f17dd6b8e6f32532bfb0578c9a3
const url = 'localhost';
const port = '3000';
const entryPoint = 'api/comments';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
    commentsByImageId: (_, { imageID }) =>
      generalRequest(`${URL}?imageID=${imageID}`, 'GET'),
  },
  Mutation: {
    createComment: (_, { imageID, message }) =>
<<<<<<< HEAD
      generalRequest(`${URL}`, 'POST', { imageID, message }),
    updateComment: (_, { idc, newMessage }) =>
      generalRequest(`${URL}/${idc}?newMessage=${newMessage}`, 'PUT'),
    deleteComment: (_, { idc }) => generalRequest(`${URL}/${idc}`, 'DELETE'),
=======
      generalRequest(`${URL}/api/comments`, 'POST', { imageID, message }),
    updateComment: (_, { idc, newMessage }) =>
      generalRequest(
        `${URL}/api/comments/${idc}?newMessage=${newMessage}`,
        'PUT',
      ),
    deleteComment: (_, { idc }) =>
      generalRequest(`${URL}/api/comments/${idc}`, 'DELETE'),
>>>>>>> a42c94bc2f5a4f17dd6b8e6f32532bfb0578c9a3
  },
};

const url$1 = 'host.docker.internal';
const port$1 = '4000';
const entryPoint$1 = 'categories';

const URL$1 = `http://${url$1}:${port$1}/${entryPoint$1}`;

const resolvers$1 = {
  Query: {
    allCategories: (_) => getRequest(URL$1, ''),
    categoryById: (_, { id }) => generalRequest(`${URL$1}/${id}`, 'GET'),
  },
  Mutation: {
    createCategory: (_, { category }) =>
      generalRequest(`${URL$1}/`, 'POST', category),
    updateCategory: (_, { id, category }) =>
      generalRequest(`${URL$1}/${id}`, 'PUT', category),
    deleteCategory: (_, { id }) => generalRequest(`${URL$1}/${id}`, 'DELETE'),
  },
};

//como debemos importar los typeDef
// import {} from './Imagine/imagine_auth_ms/typeDefs';
// import {} from './Imagine/imagine_collection_ms/typeDefs';
// import {} from './Imagine/imagine_image_ms/typeDefs';
// import {} from './Imagine/imagine_profile_ms/typeDefs';

//como debemos importar los resolvers
// import authResolvers from './Imagine/imagine_auth_ms/resolvers';
// import collectionResolvers from './Imagine/imagine_collection_ms/resolvers';
// import imageResolvers from './Imagine/imagine_image_ms/resolvers';
// import profileResolvers from './Imagine/imagine_profile_ms/resolvers';

// merge the typeDefs -- esto nos toca con cada typeDefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', categoryTypeDef, commentTypeDef],
  [commentQueries, categoryQueries],
  [commentMutations, categoryMutations],
);

// Generate the schema object from your types definition. -- lomismo la enfermedad del lomo :v
var graphQLSchema = graphqlTools.makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge([
    { JSON: GraphQLJSON }, // allows scalar JSON
    resolvers$1,
    resolvers,
  ]),
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
