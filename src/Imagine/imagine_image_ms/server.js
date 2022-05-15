// export const urlImages = 'host.docker.internal'
// export const portImages = '8080'
export const urlImages = process.env.IMAGES_MS_URL
export const portImages = process.env.IMAGES_MS_PORT
export const entryPointImages = 'api'
export const entryPoint2Images = 'images'
export const entryPointImagesOwnerId = 'people'
export const entryPointImagesImageStorageId = 'id'