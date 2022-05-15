export const authTypeDef = `
type UserAUTH {
    id: Int!
    username: String!
    password_digest: String!
    created_at: String!
    updated_at: String!
}
input UserAUTHInput {
    username: String!
    password: String!
    password_confirmation: String!
}
input UserInputUpdate {
    username: String!
    password: String!
    password_confirmation: String!
    actual_password: String!
}
type Login {
    username: String!
    token: String!
    exp: String!
}
input LoginInput {
    username: String!
    password: String!
}`;

export const authQueries =`
    allUsers(token: String!): [UserAUTH]!
    userById(id: Int!, token: String!): UserAUTH!
`;

export const authMutations = `
    createUserAUTH(user: UserAUTHInput!): UserAUTH!
    updateUser(id: Int!, token: String!, user: UserInputUpdate!): UserAUTH!
    deleteUser(id: Int!, token: String!): Int
    login(login: LoginInput!): Login!
`;
