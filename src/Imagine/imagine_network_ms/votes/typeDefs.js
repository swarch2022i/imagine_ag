export const voteTypeDef = `
  type Vote{
    _id: String
    imageID: String
    option: String
    votes: Int
  }
  type Response{
    ok: Boolean
    votes: [Vote]
    vote: Vote
  }
  input VoteInput{
    _id: String!
    imageID: String!
    option: String!
    votes: Int!
  }
`

export const voteQueries = `
  votesByImageId(imageID: String!): Response!
`

export const voteMutations = `
  addVote(vote: VoteInput!): Response!
`
