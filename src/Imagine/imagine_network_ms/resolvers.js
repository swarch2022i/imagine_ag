import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    commentsByImageId: (_, { imageID }) =>
      generalRequest(`${URL}?imageID=${imageID}`, 'GET'),
  },
  Mutation: {
    createComment: (_, { imageID, message }) =>
      generalRequest(`${URL}/api/comments`, 'POST', { imageID, message }),
    updateComment: (_, { idc, newMessage }) =>
      generalRequest(
        `${URL}/api/comments/${idc}?newMessage=${newMessage}`,
        'PUT',
      ),
    deleteComment: (_, { idc }) =>
      generalRequest(`${URL}/api/comments/${idc}`, 'DELETE'),
  },
}

export default resolvers
