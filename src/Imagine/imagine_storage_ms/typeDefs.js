export const imageStorageTypeDef = `
    type imageStorage {
        url: String!
    }
    input imageStorageInput {
        url: String!
    }`;

export const imageStorageQueries = `
    allImageStorage: [imageStorage]!
    imageStorageById(imageStorageId: String!): imageStorage
`

export const imageStorageMutations = `
    deleteImageStorage(imageStorageId: String!): Boolean
`