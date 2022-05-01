import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    allImageStorage: (_) => getRequest(URL, ''),
    imageStorageById: async(_, { imageStorageId }) => {
      console.log(`${URL}/${imageStorageId}`)
      await generalRequest(`${URL}/${imageStorageId}`, 'GET')
    },
  },
  Mutation: {
    deleteImageStorage: (_, { imageStorageId }) => generalRequest(`${URL}/${imageStorageId}`, 'DELETE'),
  },
}

export default resolvers