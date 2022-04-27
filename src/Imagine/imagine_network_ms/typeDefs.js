export const commentTypeDef = `
  type Comment{
    imageID: String!
    message: String!
  }
  input commentInput{
    idc: String!
    message: String!
  }`

export const commentQueries = `
  commentsByImageId(imageID: String): Comment
`

export const commentMutations = `
  createComment(imageID: String!, message: String!): Comment!
  updateComment(idc: String!, newMessage: String!): Comment!
  deleteComment(idc: String): Int
`
