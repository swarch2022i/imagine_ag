import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}/${entryPoint}`
  // const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    allImageStorage: (_) => {
      console.log(URL)
      return getRequest(URL, '')
    },
    imageStorageById: (_, { id }) => generalRequest(`${URL}/${id}`, 'GET'),
  },
  Mutation: {
    deleteImageStorage: (_, { id }) => generalRequest(`${URL}/${id}`, 'DELETE'),
  },
}

export default resolvers