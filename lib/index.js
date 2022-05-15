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
 * @param {string} accessToken
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

async function generalRequestAUTH(url, method, body, fullResponse, accessToken) {
	var parameters = {};
	if(accessToken){
		parameters = {
			method,
				uri: encodeURI(url),
				body,
                auth: {
                    'bearer': accessToken
                },
				json: true,
				resolveWithFullResponse: fullResponse
		};
	}else{
		parameters = {
			method,
				uri: encodeURI(url),
				body,
				json: true,
				resolveWithFullResponse: fullResponse
		};
	}
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
      imageByOwnerId(id: String!): Image!
      imageByImageStorageId(id: String!): Image!
  `;

const imageMutations = `
    createImage(image: ImageInput!): Image!
    updateImage(id: String!, image: ImageInput!): Image!
    deleteImage(id: String!): String
`;

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

const userTypeDef = `
	type user {
		uuid: String!
	}

	input userInput {
		uuid: String!
	}
`;

const responseTypeDef = `
	type response {
		status: String!
		rows: Int
		data: [collection]
		collection: collection
		error: String
		message: String
		uuid: String
		redirect: String
	}
`;

const collectionsTypeDef = `
	type collection {
		title: String!
		images_ids: [String!]!
		description: String!
	}

	input image {
		uuid: String
	}
	
	input collectionInput {
		uuid: String!
		title: String!
		images_ids: [String!]!
		description: String
	}

	input collectionInputPatch {
		uuid: String!
		title: String
		images_ids: [image]
		description: String
	}
`;

const collectionsQueries = `
	collectionInfo(uuid: String!): response!
	userCollections(uuid: String!): response!
`;

const collectionsMutations = `
	createCollection(collection: collectionInput!): response!
	updateCollection(collection: collectionInputPatch!): response!
	deleteCollection(uuid: String!): response!
	deleteImage(uuid: String!): response!
`;

const userMutations = `
	createUser(uuid: String!): response!
`;

const profileTypeDef = `
type Perfil {
    id: Int!
    idUsuario: String!
    nombre: String!
    idImagenPerfil: String!
    texto: String!
    numfollows : Int!
    numfollowers : Int!
}
input PerfilInput {
    idUsuario: String!
    nombre: String!
    idImagenPerfil: String!
    texto: String!
    numfollows : Int!
    numfollowers : Int!
}
type Follows {
    id: Int!
    idUsuarioFollower: String!
    nombreFollower: String!
    idUsuarioFollowBy: String!
    nombreFolloweBy: String!
}
input FollowsInput {
    idUsuarioFollower: String!
    nombreFollower: String!
    idUsuarioFollowBy: String!
    nombreFolloweBy: String!
}
`;
const profileQueries = `
allPerfiles: [Perfil]!
PerfilById(id: Int!): Perfil!
getPerfilByIdUsuario(idUsuario: String!): Perfil!

allFollows: [Follows]!
getFollowsByid(id: Int!): Follows!
getAllFollowersById(idFollower: String!): Follows!
getAllFollowById(idFollow: String!): Follows!
`;

const profileMutations = `
createPerfil(perfil: PerfilInput!): Perfil!
putPerfil(id: Int!,perfil: PerfilInput!):Perfil!
deletePerfil(id: Int!): Perfil!

createFollow(follow : FollowsInput!): Follows!
deleteFollows(id: Int!): Follows!
`;

const authTypeDef = `
type UserAUTH {
    id: Int!
    username: String!
    password_digest: String!
    created_at: String!
    updated_at: String!
}
input UserAUTHInput {
    username: String!
    password: String!
    password_confirmation: String!
}
input UserInputUpdate {
    username: String!
    password: String!
    password_confirmation: String!
    actual_password: String!
}
type Login {
    username: String!
    token: String!
    exp: String!
}
input LoginInput {
    username: String!
    password: String!
}`;

const authQueries =`
    allUsers(token: String!): [UserAUTH]!
    userById(id: Int!, token: String!): UserAUTH!
`;

const authMutations = `
    createUserAUTH(user: UserAUTHInput!): UserAUTH!
    updateUser(id: Int!, token: String!, user: UserInputUpdate!): UserAUTH!
    deleteUser(id: Int!, token: String!): Int
    login(login: LoginInput!): Login!
`;

// export const urlImages = 'host.docker.internal'
// export const portImages = '8080'


const entryPointImages = 'api';
const entryPoint2Images = 'images';
const entryPointImagesOwnerId = 'people';
const entryPointImagesImageStorageId = 'id';

const URLImages = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}`;
const URLImagesOwnerId = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}/${entryPointImagesOwnerId}`;
const URLImagesImageStorageId = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}/${entryPointImagesImageStorageId}`;

const resolversImage = {
  Query: {
    allImages: (_) => {
      console.log(URLImages);
      return getRequest(URLImages, '')
    },
    imageById: (_, { id }) => generalRequest(`${URLImages}/${id}`, 'GET'),
    imageByOwnerId: (_, { id }) => generalRequest(`${URLImagesOwnerId}/${id}`, 'GET'),
    imageByImageStorageId: (_, { id }) => generalRequest(`${URLImagesImageStorageId}/${id}`, 'GET'),
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

// export const url = 'localhost';
// export const port = '8000'
const urlCollections = process.env.COLLECTIONS_MS_URL;
//export const portCollections = process.env.COLLECTIONS_MS_PORT
const entryPoint$1 = 'api';

const URL$1 = `http://${urlCollections}/${entryPoint$1}`;

const resolvers$1 = {
  Query: {
    collectionInfo: (_, { uuid }) => getRequest(`${URL$1}`, 'collection', { uuid }),                        // Done
    userCollections: (_, { uuid }) => getRequest(`${URL$1}`, 'owner', { uuid }),                            // Done 
  },
  Mutation: {
    createCollection: (_, { collection }) => generalRequest(`${URL$1}/collection`, `POST`, collection),     // Done
    updateCollection: (_, { collection }) => generalRequest(`${URL$1}/collection`, `PATCH`, collection),    // Done
    deleteCollection: (_, { uuid }) => generalRequest(`${URL$1}/collection`, `DELETE`, { uuid }),           // Done
    createUser: (_, { uuid }) => generalRequest(`${URL$1}/owner`, `POST`, { uuid }),                        // Done
    deleteImage: (_, { uuid }) => generalRequest(`${URL$1}/image`, `DELETE`, { uuid }),                     // Done
  },
};

// export const url = 'host.docker.internal'
// export const port = '3000'
const urlComments = process.env.COMMENTS_MS_URL;
// export const portComments = process.env.COMMENTS_MS_PORT
const entryPoint$2 = 'api';
const entryPoint2 = 'comments';

const URL$2 = `http://${urlComments}/${entryPoint$2}/${entryPoint2}`;

const resolvers$2 = {
  Query: {
    commentsByImageId: (_, { imageID }) => {
      console.log(`${URL$2}?imageID=${imageID}`);
      return generalRequest(`${URL$2}?imageID=${imageID}`, 'GET')
    },
  },
  Mutation: {
    createComment: (_, { imageID, message }) =>
      generalRequest(`${URL$2}`, 'POST', { imageID, message }),
    updateComment: (_, { idc, newMessage }) =>
      generalRequest(`${URL$2}/${idc}?newMessage=${newMessage}`, 'PUT'),
    deleteComment: (_, { idc }) => generalRequest(`${URL$2}/${idc}`, 'DELETE'),
  },
};

// export const url = 'host.docker.internal'
// export const port = '3000'
const urlVotes = process.env.VOTES_MS_URL;
// export const portVotes = process.env.VOTES_MS_PORT
const entryPoint$3 = 'api';
const entryPoint2$1 = 'votes';

const URL$3 = `http://${urlVotes}/${entryPoint$3}/${entryPoint2$1}`;

const resolvers$3 = {
  Query: {
    votesByImageId: (_, { imageID }) =>
      generalRequest(`${URL$3}/${imageID}`, 'GET'),
  },
  Mutation: {
    addVote: async (_, { vote }) => generalRequest(`${URL$3}`, 'PUT', vote),
  },
};

// export const url = 'host.docker.internal'
// export const port = '8080'
const urlProfile = process.env.PROFILE_MS_URL;
//export const portProfile = process.env.IMAGES_MS_PORT
const entryPointPerfiles = 'api/perfiles';
const entryPointFollows = 'api/follows';

const URLP = `http://${urlProfile}/${entryPointPerfiles}`;
const URLF = `http://${urlProfile}/${entryPointFollows}`;

const resolvers$4 = {
  Query: {
    allPerfiles:(_) => getRequest(`${URLP}/getPerfiles`, ''),
    PerfilById: (_, { id }) => generalRequest(`${URLP}/getPerfil/${id}`, 'GET'),
    getPerfilByIdUsuario:(_, { idUsuario}) =>generalRequest(`${URLP}/getPerfilByIdUsuario`,'GET', { id: idUsuario}),

    allFollows:(_) => getRequest(`${URLF}/getAllFollows`, ''),
    getFollowsByid: (_, { id }) => generalRequest(`${URLF}/getFollows/${id}`, 'GET'),
    getAllFollowersById:(_) =>generalRequest(`${URLF}/getAllFollowersById`,'GET'),
    getAllFollowById:(_) =>generalRequest(`${URLF}/getAllFollowsById`,'GET'),
  },
  Mutation: {
    createPerfil: (_, { perfil }) =>
    generalRequest(`${URLP}/createPerfil/`, 'POST', perfil),
    deletePerfil: (_, { id }) => generalRequest(`${URLP}/deletePerfil/${id}`, 'DELETE'),

    createFollow: (_, { follow }) =>
    generalRequest(`${URLF}/createFollow/`, 'POST', follow),
    deleteFollows: (_, { id }) => generalRequest(`${URLF}/deleteFollows/${id}`, 'DELETE'),
  },
};

// export const urlCollections = process.env.COLLECTIONS_MS_URL
// export const port = '3000'
const urlAUTH = process.env.AUTH_MS_URL;
const entryPoint$4 = '';

const URL$4 = `http://${urlAUTH}/${entryPoint$4}`;

const authResolvers = {
  Query: {
    allUsers: (_, { token }) => generalRequestAUTH(`${URL$4}/users/`, 'GET',{},false,token),
    userById: (_, { id, token }) => generalRequestAUTH(`${URL$4}/users/${id}`, 'GET', {},false,token),
  },
  Mutation: {
    createUserAUTH: (_, { user }) =>
      generalRequestAUTH(`${URL$4}/users`, 'POST', user),
    updateUser: (_, { id, token, user }) =>
      generalRequestAUTH(`${URL$4}/users/${id}`, 'PUT', user,false,token),
    deleteUser: (_, { id, token }) => 
      generalRequestAUTH(`${URL$4}/users/${id}`, 'DELETE',{},false,token),
    login: (_, { login }) =>
      generalRequestAUTH(`${URL$4}/auth/login`, 'POST', login),
  },
};

//Mutations, Queries and TypeDefs imports
//Resolvers imports
// Merge mutations, queries and typdefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', imageTypeDef, imageStorageTypeDef, userTypeDef, collectionsTypeDef, responseTypeDef,commentTypeDef,
  voteTypeDef,profileTypeDef, authTypeDef],
  [imageQueries, imageStorageQueries, collectionsQueries,commentQueries, voteQueries,profileQueries, authQueries],
  [imageMutations, imageStorageMutations, collectionsMutations, userMutations,commentMutations, voteMutations,profileMutations, authMutations],
);

// Generate Schema with all above and resolvers
var graphQLSchema = graphqlTools.makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge({ JSON: GraphQLJSON }, // allows scalar JSON
    // categoryResolvers,
    resolversImage,
    resolvers,
    resolvers$1,
    resolvers$2,
    resolvers$3,
    resolvers$4,
    authResolvers
  ),
});

const FormData = require('form-data');
// const axios = require('axios').default;
// const multer = require('@koa/multer');

const upload = multer({
  storage: multer.memoryStorage()
});

const routerStorage = new KoaRouter();

const URL$5 = `http://${url}:${port}/${entryPoint}`;

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

      let response = await axios.post(`${URL$5}/upload`, formData, {
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
