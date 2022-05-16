export const imageTypeDef = `
  type Image {
      id: String!
      name: String
      description: String
      tag: [String]
      ownerId: String!
      commentsId: [String]
      imageStorageId: String!
      url: String!
  }
  input ImageInput {
      name: String
      description: String
      tag: [String]
      ownerId: String!
      commentsId: [String]
      imageStorageId: String!
      url: String!

  }`;

export const imageQueries = `
      allImages: [Image]!
      imageById(id: String!): Image!
      imageByOwnerId(id: String!): [Image]!
      imageByImageStorageId(id: String!): Image!
      imageByName(name: String!): [Image]!
      imageByTag(tag: String!): [Image]!
      `;

export const imageMutations = `
    createImage(image: ImageInput!): Image!
    updateImage(id: String!, image: ImageInput!): Image!
    deleteImage(id: String!): String
`;