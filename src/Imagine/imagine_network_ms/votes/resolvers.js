import { generalRequest } from '../../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    votesByImageId: (_, { imageID }) =>
      generalRequest(`${URL}/${imageID}`, 'GET'),
  },
  Mutation: {
    addVote: async (_, { vote }) => {
      const test = await generalRequest(`${URL}`, 'PUT', vote)
      console.log('asd', { vote })
      console.log(test)
      return test
    },
  },
}

export default resolvers
