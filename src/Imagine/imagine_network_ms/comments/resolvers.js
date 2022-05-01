import { generalRequest } from '../../../utilities'
import { urlComments, portComments, entryPoint, entryPoint2 } from './server'

const URL = `http://${process.env.COMMENTS_MS_URL}/${entryPoint}/${entryPoint2}`

const resolvers = {
  Query: {
    commentsByImageId: (_, { imageID }) => {
      console.log(`${URL}?imageID=${imageID}`)
      return generalRequest(`${URL}?imageID=${imageID}`, 'GET')
    },
  },
  Mutation: {
    createComment: (_, { imageID, message }) =>
      generalRequest(`${URL}`, 'POST', { imageID, message }),
    updateComment: (_, { idc, newMessage }) =>
      generalRequest(`${URL}/${idc}?newMessage=${newMessage}`, 'PUT'),
    deleteComment: (_, { idc }) => generalRequest(`${URL}/${idc}`, 'DELETE'),
  },
}

export default resolvers
