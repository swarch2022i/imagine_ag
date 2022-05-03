import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    allUsers: (_, { token }) => generalRequest(URL, '', token=token),
    userById: (_, { id, token }) => generalRequest(`${URL}/users/${id}`, 'GET', token=token),
  },
  Mutation: {
    createUser: (_, { user }) =>
      generalRequest(`${URL}/users`, 'POST', user),
    updateUser: (_, { id, token, user }) =>
      generalRequest(`${URL}/users/${id}`, 'PUT', user, token=token),
    deleteUser: (_, { id, token }) => 
      generalRequest(`${URL}/users/${id}`, 'DELETE', token=token),
    login: (_, { login }) =>
      generalRequest(`${URL}/auth/login`, 'POST', login),
  },
}

export default resolvers
