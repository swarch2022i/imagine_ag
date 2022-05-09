import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    collectionInfo: (_, { uuid }) => getRequest(`${URL}`, 'collection', { uuid }),                        // Done
    userCollections: (_, { uuid }) => getRequest(`${URL}`, 'owner', { uuid }),                            // Done 
  },
  Mutation: {
    createCollection: (_, { collection }) => generalRequest(`${URL}/collection`, `POST`, collection),     // Done
    updateCollection: (_, { collection }) => generalRequest(`${URL}/collection`, `PATCH`, collection),    // Done
    deleteCollection: (_, { uuid }) => generalRequest(`${URL}/collection`, `DELETE`, { uuid }),           // Done
    createUser: (_, { uuid }) => generalRequest(`${URL}/owner`, `POST`, { uuid }),                        // Done
    deleteImage: (_, { uuid }) => generalRequest(`${URL}/image`, `DELETE`, { uuid }),                     // Done
  },
}

export default resolvers
