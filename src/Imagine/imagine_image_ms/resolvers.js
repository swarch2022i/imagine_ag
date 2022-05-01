import { generalRequest, getRequest } from '../../utilities'
import { urlImages, portImages, entryPointImages, entryPoint2Images } from './server'

const URLImages = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}`
  // const URLImages = `http://${urlImages}:${portImages}/${entryPointImages}/${entryPoint2Images}`

const resolversImage = {
  Query: {
    allImages: (_) => {
      console.log(URLImages)
      return getRequest(URLImages, '')
    },
    imageById: (_, { id }) => generalRequest(`${URLImages}/${id}`, 'GET'),
  },
  Mutation: {
    createImage: (_, { image }) =>
      generalRequest(`${URLImages}/`, 'POST', image),
    updateImage: (_, { id, image }) =>
      generalRequest(`${URLImages}/${id}`, 'PUT', image),
    deleteImage: (_, { id }) =>
      generalRequest(`${URLImages}/${id}`, 'DELETE'),
  },
}

export default resolversImage