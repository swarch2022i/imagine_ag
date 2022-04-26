import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    commentsByImageId: (_, { imageID }) =>
      generalRequest(`${URL}/${imageID}`, 'GET'),
  },
  Mutation: {},
}

export default resolvers
