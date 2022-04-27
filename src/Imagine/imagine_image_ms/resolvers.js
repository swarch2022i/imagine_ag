import { generalRequest, getRequest } from '../../utilities'
import { urlImages, portImages, entryPointImages, entryPoint2Images } from './server'

const URLImages = `http://${urlImages}:${portImages}/${entryPointImages}/${entryPoint2Images}`

const resolversImage = {
  Query: {
    allImages: (_) => getRequest(URLImages, ''),
    imageById: (_, { id }) => generalRequest(`${URLImages}/${id}`, 'GET'),
  },
  Mutation: {
    createImage: (_, { image }) =>
      generalRequest(`${URLImages}/`, 'POST', image),//Tal vez falle aqui
    updateImage: (_, { id, image }) =>
      generalRequest(`${URLImages}/${id}`, 'PUT', image),
    deleteImage: (_, { id }) => 
      generalRequest(`${URLImages}/${id}`, 'DELETE'),
  },
}

export default resolversImage
