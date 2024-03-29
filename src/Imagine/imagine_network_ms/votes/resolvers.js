import { generalRequest } from '../../../utilities'
import { urlVotes, entryPoint, entryPoint2 } from './server'

const URL = `http://${urlVotes}/${entryPoint}/${entryPoint2}`

const resolvers = {
  Query: {
    votesByImageId: (_, { imageID }) =>
      generalRequest(`${URL}/${imageID}`, 'GET'),
  },
  Mutation: {
    addVote: async (_, { vote }) => generalRequest(`${URL}`, 'PUT', vote),
  },
}

export default resolvers
