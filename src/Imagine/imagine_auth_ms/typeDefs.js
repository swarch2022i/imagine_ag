export const authTypeDef = `
type User {
    id: Int!
    username: String!
    password_digest: String!
    created_at: String!
    updated_at: String!
}
input UserInput {
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
    allUsers(token: String!): [User]!
    userById(id: Int!, token: String!): User!
`;

export const authMutations = `
    createUser(user: UserInput!): User!
    updateUser(id: Int!, token: String!, user: UserInputUpdate!): User!
    deleteUser(id: Int!, token: String!): Void
    login(login: LoginInput!): Login!
`;
