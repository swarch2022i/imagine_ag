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
    resolveWithFullResponse: fullResponse,
  };
  if (process.env.SHOW_URLS) {
    // eslint-disable-next-line
    console.log(url);
  }

  try {
    let response = await request(parameters);
    console.log('respuesta', response);
    return response
    // return await request(parameters)
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

<<<<<<< HEAD
const imageTypeDef = `
  type Image {
      id: String!
      name: String
      description: String
      tags: [String]
      ownerId: String!
      commentsId: [String]
      imageStorageId: String!
      url: String!
  }
  input ImageInput {
      name: String
      description: String
      tags: [String]
      ownerId: String!
      commentsId: [String]
      imageStorageId: String!
      url: String!

  }`;

const imageQueries = `
      allImages: [Image]!
      imageById(id: String!): Image!
  `;

const imageMutations = `
    createImage(image: ImageInput!): Image!
    updateImage(id: String!, image: ImageInput!): Image!
    deleteImage(id: String!): String
`;

<<<<<<< HEAD
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
=======
const userTypeDef = `
	type user {
		uid: String!
	}

	input userInput {
		uid: String!
	}
`;

const responseTypeDef = `
	type response {
		status: String!
		rows: Int
		data: [collection]
		collection: collection
		error: String
	}
`;

const collectionsTypeDef = `
	type collection {
		uid: String!
		images_ids: [String!]!
		description: String!
	}

	input collectionsInput {
		uid: String!
		images_ids: [String!]!
		description: String!
	}
`;

const collectionsQueries = `
	collection(uid: String!): response!
	userCollections(uid: String!): response!
`;

const collectionsMutations = `
	createCollection(collection: collectionsInput!): response!
	updateCollection(uid_owner: String!, uid_collection: String!, description: String, images_ids: [String]): response!
	deleteCollection(uid: String!): response!
`;
const userMutations = `
	createUser(user: userInput!): response!
`;

const url = 'localhost';
const port = '8000';
const entryPoint = 'api';
>>>>>>> f881c46e0d7763b9b6581fc2c8687618348fa5f0

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
<<<<<<< HEAD
    allImageStorage: (_) => getRequest(URL, ''),
    imageStorageById: (_, { id }) => generalRequest(`${URL}/${id}`, 'GET'),
  },
  Mutation: {
    deleteImageStorage: (_, { id }) => generalRequest(`${URL}/${id}`, 'DELETE'),
  },
};

=======
>>>>>>> ac1f7fcc0b0e001e9905366473ad81b97a5c8397
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
  commentsByImageId(imageID: String!): Res!
`;

const commentMutations = `
  createComment(imageID: String!, message: String!): Res!
  updateComment(idc: String!, newMessage: String!): Res!
  deleteComment(idc: String!): Res!
`;

const voteTypeDef = `
  type Vote{
    _id: String
    imageID: String
    option: String
    votes: Int
  }
  type Response{
    ok: Boolean
    votes: [Vote]
    vote: Vote
  }
  input VoteInput{
    _id: String!
    imageID: String!
    option: String!
    votes: Int!
  }
`;

const voteQueries = `
  votesByImageId(imageID: String!): Response!
`;

const voteMutations = `
  addVote(vote: VoteInput!): Response!
`;

// export const urlImages = 'host.docker.internal'
// export const portImages = '8080'


const entryPointImages = 'api';
const entryPoint2Images = 'images';

const URLImages = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}`;
  // const URLImages = `http://${urlImages}:${portImages}/${entryPointImages}/${entryPoint2Images}`

const resolversImage = {
  Query: {
    allImages: (_) => {
      console.log(URLImages);
      return getRequest(URLImages, '')
    },
    imageById: (_, { id }) => generalRequest(`${URLImages}/${id}`, 'GET'),
  },
  Mutation: {
    createImage: (_, { image }) =>
      generalRequest(`${URLImages}/`, 'POST', image),
    updateImage: (_, { id, image }) =>
      generalRequest(`${URLImages}/${id}`, 'PUT', image),
    deleteImage: (_, { id }) =>
      generalRequest(`${URLImages}/${id}`, 'DELETE'),
  },
};

// export const url = 'host.docker.internal'
// export const port = '1234'
// export const entryPoint = 'api/storage'
// export const url = 'localhost'
// export const port = '3000'
const url = process.env.STORAGE_MS_URL;
const port = process.env.STORAGE_MS_PORT;
const entryPoint = 'api/storage';

const URL = `http://${url}/${entryPoint}`;
  // const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    allImageStorage: (_) => {
      console.log(URL);
      return getRequest(URL, '')
    },
    imageStorageById: (_, { id }) => generalRequest(`${URL}/${id}`, 'GET'),
  },
  Mutation: {
    deleteImageStorage: (_, { id }) => generalRequest(`${URL}/${id}`, 'DELETE'),
  },
};

const url$1 = 'host.docker.internal';
const port$1 = '3000';
const entryPoint$1 = 'api';

const URL$1 = `http://${url$1}:${port$1}/${entryPoint$1}/${entryPoint$1}`;

const resolvers$1 = {
  Query: {
    commentsByImageId: (_, { imageID }) =>
      generalRequest(`${URL$1}?imageID=${imageID}`, 'GET'),
  },
  Mutation: {
    createComment: (_, { imageID, message }) =>
      generalRequest(`${URL$1}`, 'POST', { imageID, message }),
    updateComment: (_, { idc, newMessage }) =>
      generalRequest(`${URL$1}/${idc}?newMessage=${newMessage}`, 'PUT'),
    deleteComment: (_, { idc }) => generalRequest(`${URL$1}/${idc}`, 'DELETE'),
  },
};

const url$2 = 'host.docker.internal';
const port$2 = '3000';
const entryPoint$2 = 'api';
const entryPoint2$1 = 'votes';

const URL$2 = `http://${url$2}:${port$2}/${entryPoint$2}/${entryPoint2$1}`;

const resolvers$2 = {
  Query: {
    votesByImageId: (_, { imageID }) =>
      generalRequest(`${URL$2}/${imageID}`, 'GET'),
  },
  Mutation: {
    addVote: async (_, { vote }) => generalRequest(`${URL$2}`, 'PUT', vote),
  },
};

//Mutations, Queries and TypeDefs imports
//Resolvers imports
// Merge mutations, queries and typdefs
const mergedTypeDefs = mergeSchemas(
<<<<<<< HEAD
  ['scalar JSON', imageTypeDef, imageStorageTypeDef], [imageQueries, imageStorageQueries], [imageMutations, imageStorageMutations],
=======
    collection: (_, { uid }) => getRequest(`${URL}`, 'collection', { uid }),
    userCollections: (_, { uid }) => getRequest(`${URL}`, 'user', { uid }),
  },
  Mutation: {
    createCollection: (_, { collection }) => generalRequest(`${URL}/collection`, `POST`, collection),
    updateCollection: (_, { uid_owner, uid_collection, description, images_ids }) => generalRequest(`${URL}/collection`, `PATCH`, { uid_owner, uid_collection, description, images_ids }),
    deleteCollection: (_, { uid_owner, uid_collection }) => generalRequest(`${URL}/collection`, `DELETE`, { uid_owner, uid_collection }),
    createUser: async (_, { user }) => await generalRequest(`${URL}/user`, `POST`, user),
  },
};

//como debemos importar los typeDef
// import {} from './swarch2022i/imagine_auth_ms/typeDefs';
// import {} from './swarch2022i/imagine_image_ms/typeDefs';
// import {} from './swarch2022i/imagine_network_ms/typeDefs';
// import {} from './swarch2022i/imagine_profile_ms/typeDefs';

// import {
//   categoryMutations,
//   categoryQueries,
//   categoryTypeDef,
// } from './swarch2022i/example/typeDefs'

//como debemos importar los resolvers
// import authResolvers from './swarch2022i/imagine_auth_ms/resolvers';
// import imageResolvers from './swarch2022i/imagine_image_ms/resolvers';
// import networkResolvers from './swarch2022i/imagine_network_ms/resolvers';
// import profileResolvers from './swarch2022i/imagine_profile_ms/resolvers';

// import categoryResolvers from './swarch2022i/categories/resolvers'

// merge the typeDefs -- esto nos toca con cada typeDefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', userTypeDef, collectionsTypeDef, responseTypeDef],
  [collectionsQueries,],
  [collectionsMutations, userMutations,],
>>>>>>> f881c46e0d7763b9b6581fc2c8687618348fa5f0
=======
  [
    'scalar JSON',
    imageTypeDef,
    imageStorageTypeDef,
    commentTypeDef,
    voteTypeDef,
  ],
  [imageQueries, imageStorageQueries, commentQueries, voteQueries],
  [imageMutations, imageStorageMutations, commentMutations, voteMutations],
>>>>>>> ac1f7fcc0b0e001e9905366473ad81b97a5c8397
);

// Generate Schema with all above and resolvers
var graphQLSchema = graphqlTools.makeExecutableSchema({
  typeDefs: mergedTypeDefs,
<<<<<<< HEAD
<<<<<<< HEAD
  resolvers: merge({ JSON: GraphQLJSON }, // allows scalar JSON
    // categoryResolvers,
    resolversImage,
    resolvers
=======
  resolvers: merge(
    { JSON: GraphQLJSON }, // allows scalar JSON
    resolvers,
>>>>>>> f881c46e0d7763b9b6581fc2c8687618348fa5f0
=======
  resolvers: merge(
    { JSON: GraphQLJSON }, // allows scalar JSON
    resolversImage,
    resolvers,
    resolvers$1,
    resolvers$2,
>>>>>>> ac1f7fcc0b0e001e9905366473ad81b97a5c8397
  ),
});

const FormData = require('form-data');
// const axios = require('axios').default;
// const multer = require('@koa/multer');

const upload = multer({
  storage: multer.memoryStorage()
});

const routerStorage = new KoaRouter();

const URL$3 = `http://${url}:${port}/${entryPoint}`;

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

      let response = await axios.post(`${URL$3}/upload`, formData, {
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
