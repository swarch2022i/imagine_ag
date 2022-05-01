'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var mount = _interopDefault(require('koa-mount'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');
var multer = _interopDefault(require('@koa/multer'));
var axios = _interopDefault(require('axios'));

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
  const parameters = {
    method,
    uri: encodeURI(url),
    body,
    json: true,
    resolveWithFullResponse: fullResponse
  };
  if (process.env.SHOW_URLS) {
    // eslint-disable-next-line
    console.log(url);
  }

  try {
    let response = await request(parameters);
    console.log('respuesta', response);
    return response;
    // return await request(parameters)
  } catch (err) {
    return err;
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
	return queryUrl;
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
	return generalRequest(queryUrl, 'GET');
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
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const imageTypeDef = `
  type Image {
      id: Int!
      name: String
      description: String
      tags: [String]
      ownerId: Int!
      commentsId: [Int]
      imageStorageId: String!
      url: String!
  }
  input ImageInput {
      name: String
      description: String
      tags: [String]
      ownerId: Int!
      commentsId: [Int]
      imageStorageId: String!
      url: String!

  }`;

const imageQueries = `
      allImages: [Image]!
      imageById(id: Int!): Image!
  `;

const imageMutations = `
    createImage(image: ImageInput!): Image!
    updateImage(id: Int!, image: ImageInput!): Image!
    deleteImage(id: Int!): Int
`;

const urlImages = 'host.docker.internal';
const portImages = '8080';
const entryPointImages = 'api';
const entryPoint2Images = 'images';

const URLImages = `http://${urlImages}:${portImages}/${entryPointImages}/${entryPoint2Images}`;

const resolversImage = {
  Query: {
    allImages: (_) => getRequest(URLImages, ''),
    imageById: (_, { id }) => generalRequest(`${URLImages}/${id}`, 'GET'),
  },
  Mutation: {
    createImage: (_, { image }) =>
      generalRequest(`${URLImages}/`, 'POST', image),//Tal vez falle aqui
    updateImage: (_, { id, image }) =>
      generalRequest(`${URLImages}/${id}`, 'PUT', image),
    deleteImage: (_, { id }) => 
      generalRequest(`${URLImages}/${id}`, 'DELETE'),
  },
};

// export const url = 'host.docker.internal'
// export const port = '1234'
// export const entryPoint = 'api/storage'
const url = 'localhost';
const port = '3000';
const entryPoint = 'api/storage';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
    allImageStorage: (_) => getRequest(URL, ''),
    imageStorageById: (_, { id }) => generalRequest(`${URL}/${id}`, 'GET'),
  },
  Mutation: {
    deleteImageStorage: (_, { id }) => generalRequest(`${URL}/${id}`, 'DELETE'),
  },
};

const imageStorageTypeDef = `
    type imageStorage {
        url: String!
    }
    type imageStorageDeleted {
        name: String!
        msg: String!
    }
    input imageStorageInput {
        url: String!
    }`;

const imageStorageQueries = `
    allImageStorage: [imageStorage]!
    imageStorageById(id: String!): imageStorage!
`;

const imageStorageMutations = `
    deleteImageStorage(id: String!): imageStorageDeleted!
`;

//como debemos importar los typeDef
// import {} from './swarch2022i/imagine_auth_ms/typeDefs';
// import {} from './swarch2022i/imagine_collection_ms/typeDefs';
// import {} from './swarch2022i/imagine_network_ms/typeDefs';
// import {} from './swarch2022i/imagine_profile_ms/typeDefs';

//como debemos importar los resolvers
// import authResolvers from './swarch2022i/imagine_auth_ms/resolvers';
// import collectionResolvers from './swarch2022i/imagine_collection_ms/resolvers';
// import networkResolvers from './swarch2022i/imagine_network_ms/resolvers';
// import profileResolvers from './swarch2022i/imagine_profile_ms/resolvers';

// import categoryResolvers from './Imagine/example/resolvers'

// merge the typeDefs -- esto nos toca con cada typeDefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', imageTypeDef, imageStorageTypeDef], [imageQueries, imageStorageQueries], [imageMutations, imageStorageMutations],
);

// Generate the schema object from your types definition. -- lomismo la enfermedad del lomo :v
var graphQLSchema = graphqlTools.makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge({ JSON: GraphQLJSON }, // allows scalar JSON
    // categoryResolvers,
    resolversImage,
    resolvers
  ),
});

const FormData = require('form-data');
// const axios = require('axios').default;
// const multer = require('@koa/multer');

const upload = multer({
  storage: multer.memoryStorage()
});

const routerStorage = new KoaRouter();

const URL$1 = `http://${url}:${port}/${entryPoint}`;

var routerStorage$1 = () => {
  routerStorage.get('/', function(ctx) {
    ctx.body = 'Hello Koa';
  });
  routerStorage.post('/', upload.array('images'), async(ctx) => {
    if (!ctx.files) {
      ctx.body = 'nada';
    } else {

      let formData = new FormData();
      for (const key in ctx.request.body) {
        formData.append(key, ctx.request.body[key]);
      }
      formData.append('images', JSON.stringify(ctx.files));

      let response = await axios.post(`${URL$1}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        ctx.body = response.data;
      } else {
        ctx.body = response.data;
      }
    }
  });
  return routerStorage.middleware()
};

// let routerStorage = require('./Imagine/imagine_storage_ms/router.js')
const app = new Koa();
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
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
  schema: graphQLSchema,
  context: { token: ctx.state.token },
  formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(mount('/ag/storage', routerStorage$1()));
app.use(router.routes());
// app.use('/api/storage', routerStorage);
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
