import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    collection: (_, { uid }) => getRequest(`${URL}`, 'collection', { uid }),
    userCollections: (_, { uid }) => getRequest(`${URL}`, 'user', { uid }),
  },
  Mutation: {
    createCollection: (_, { collection }) => generalRequest(`${URL}/collection`, `POST`, collection),
    updateCollection: (_, { uid_owner, uid_collection, description, images_ids }) => generalRequest(`${URL}/collection`, `PATCH`, { uid_owner, uid_collection, description, images_ids }),
    deleteCollection: (_, { uid_owner, uid_collection }) => generalRequest(`${URL}/collection`, `DELETE`, { uid_owner, uid_collection }),
    createUser: async (_, { user }) => await generalRequest(`${URL}/user`, `POST`, user),
  },
}

export default resolvers
