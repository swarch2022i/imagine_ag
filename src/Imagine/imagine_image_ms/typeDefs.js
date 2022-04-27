export const imageTypeDef = `
  type Image {
      id: Int!
      name: String
      description: String
      tags: [String]
      ownerId: Int!
      commentsId: [Int]
      imageStorageId: String!
      url: String!
  }
  input ImageInput {
      name: String
      description: String
      tags: [String]
      ownerId: Int!
      commentsId: [Int]
      imageStorageId: String!
      url: String!

  }`;

export const imageQueries = `
      allImages: [Image]!
      imageById(id: Int!): Image!
  `;

export const imageMutations = `
    createImage(image: ImageInput!): Image!
    updateImage(id: Int!, image: ImageInput!): Image!
    deleteImage(id: Int!): Int
`;