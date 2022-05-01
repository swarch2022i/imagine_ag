import request from 'request-promise-native'
import { formatError } from 'graphql'

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
export async function generalRequest(url, method, body, fullResponse) {
<<<<<<< HEAD
=======
  console.log('sad', url)
>>>>>>> network
  const parameters = {
    method,
    uri: encodeURI(url),
    body,
    json: true,
<<<<<<< HEAD
    resolveWithFullResponse: fullResponse
  };
  if (process.env.SHOW_URLS) {
    // eslint-disable-next-line
    console.log(url);
  }

  try {
    let response = await request(parameters)
    console.log('respuesta', response)
    return response;
    // return await request(parameters)
  } catch (err) {
    return err;
=======
    resolveWithFullResponse: fullResponse,
  }
  if (process.env.SHOW_URLS) {
    // eslint-disable-next-line
    console.log(url)
  }

  try {
    return await request(parameters)
  } catch (err) {
    return err
>>>>>>> network
  }
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
export function addParams(url, parameters) {
<<<<<<< HEAD
  let queryUrl = `${url}?`;
=======
  let queryUrl = `${url}?`
>>>>>>> network
  for (let param in parameters) {
    // check object properties
    if (
      Object.prototype.hasOwnProperty.call(parameters, param) &&
      parameters[param]
    ) {
      if (Array.isArray(parameters[param])) {
<<<<<<< HEAD
        queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
=======
        queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`
      } else {
        queryUrl += `${param}=${parameters[param]}&`
      }
    }
  }
  return queryUrl
>>>>>>> network
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
export function getRequest(url, path, parameters) {
  const queryUrl = addParams(`${url}/${path}`, parameters)
  return generalRequest(queryUrl, 'GET')
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
export function mergeSchemas(typeDefs, queries, mutations) {
  return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`
}

export function formatErr(error) {
<<<<<<< HEAD
	const data = formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}
=======
  const data = formatError(error)
  const { originalError } = error
  if (originalError && originalError.error) {
    const { path } = data
    const {
      error: { id: message, code, description },
    } = originalError
    return { message, code, description, path }
  }
  return data
}
>>>>>>> network
