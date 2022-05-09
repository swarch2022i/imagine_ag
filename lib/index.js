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
		return await request(parameters);
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
	}
`;

const collectionsTypeDef = `
	type collection {
		images_ids: [String!]!
		description: String!
	}

	input image {
		uuid: String
	}
	
	input collectionInput {
		uuid: String!
		images_ids: [String!]!
		description: String
	}

	input collectionInputPatch {
		uuid: String!
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

const url = 'localhost';
const port = '8000';
const entryPoint = 'api';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
  Query: {
    collectionInfo: (_, { uuid }) => getRequest(`${URL}`, 'collection', { uuid }),                                    // Done
    userCollections: (_, { uuid }) => getRequest(`${URL}`, 'owner', { uuid }),                                        // Done 
  },
  Mutation: {
    createCollection: (_, { collection }) => generalRequest(`${URL}/collection`, `POST`, collection),
    updateCollection: (_, { collection }) => generalRequest(`${URL}/collection`, `PATCH`, collection),
    deleteCollection: (_, { uuid }) => generalRequest(`${URL}/collection`, `DELETE`, { uuid }),
    createUser: (_, { uuid }) => generalRequest(`${URL}/owner`, `POST`, { uuid }),                                     // Done
    deleteImage: (_, { uuid }) => generalRequest(`${URL}/image`, `DELETE`, { uuid }),                                  // Done
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
);

// Generate the schema object from your types definition. -- lomismo la enfermedad del lomo :v
var graphQLSchema = graphqlTools.makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge(
    { JSON: GraphQLJSON }, // allows scalar JSON
    resolvers,
  ),
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
