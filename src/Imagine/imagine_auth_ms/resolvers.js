import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const authResolvers = {
  Query: {
    allUsers: (_, { token }) => generalRequest(`${URL}/users/`, 'GET',{},false,token),
    userById: (_, { id, token }) => generalRequest(`${URL}/users/${id}`, 'GET', {},false,token),
  },
  Mutation: {
    createUser: (_, { user }) =>
      generalRequest(`${URL}/users`, 'POST', user),
    updateUser: (_, { id, token, user }) =>
      generalRequest(`${URL}/users/${id}`, 'PUT', user,false,token),
    deleteUser: (_, { id, token }) => 
      generalRequest(`${URL}/users/${id}`, 'DELETE',{},false,token),
    login: (_, { login }) =>
      generalRequest(`${URL}/auth/login`, 'POST', login),
  },
}

export default authResolvers
