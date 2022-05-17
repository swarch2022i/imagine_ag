import { generalRequest, generalRequestAUTH, getRequest } from '../../utilities'
import { entryPoint, urlAUTH } from './server'

const URL = `http://${urlAUTH}/${entryPoint}`

const authResolvers = {
  Query: {
    allUsers: (_, { token }) => generalRequestAUTH(`${URL}/users/`, 'GET',{},false,token),
    userById: (_, { id, token }) => generalRequestAUTH(`${URL}/users/${id}`, 'GET', {},false,token),
  },
  Mutation: {
    createUserAUTH: (_, { user }) =>
      generalRequestAUTH(`${URL}/users`, 'POST', user),
    updateUser: (_, { id, token, user }) =>
      generalRequestAUTH(`${URL}/users/${id}`, 'PUT', user,false,token),
    deleteUser: (_, { id, token }) => 
      generalRequestAUTH(`${URL}/users/${id}`, 'DELETE',{},false,token),
    login: (_, { login }) =>
      generalRequestAUTH(`${URL}/auth/login`, 'POST', login),
  },
}

export default authResolvers
