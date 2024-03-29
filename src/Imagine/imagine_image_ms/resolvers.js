import { generalRequest, getRequest } from '../../utilities'
import {entryPointImages, entryPoint2Images, entryPointImagesOwnerId, entryPointImagesImageStorageId, entryPointImagesName, entryPointImagesTags } from './server'

const URLImages = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}`
const URLImagesOwnerId = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}/${entryPointImagesOwnerId}`
const URLImagesName = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}/${entryPointImagesName}`
const URLImagesTags= `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}/${entryPointImagesTags}`
const URLImagesImageStorageId = `http://${process.env.IMAGES_MS_URL}/${entryPointImages}/${entryPoint2Images}/${entryPointImagesImageStorageId}`

const resolversImage = {
  Query: {
    allImages: (_) => {
      return getRequest(URLImages, '')
    },
    imageById: (_, { id }) => generalRequest(`${URLImages}/${id}`, 'GET'),
    imageByOwnerId: (_, { id }) => generalRequest(`${URLImagesOwnerId}/${id}`, 'GET'),
    imageByImageStorageId: (_, { id }) => generalRequest(`${URLImagesImageStorageId}/${id}`, 'GET'),
    imageByName: (_, { name }) => generalRequest(`${URLImagesName}/${name}`, 'GET'),
    imageByTag: (_, { tag }) => generalRequest(`${URLImagesTags}/${tag}`, 'GET'),
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