import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint, entryPointPerfiles, entryPointFollows } from './server'

const URLP = `http://${url}:${port}/${entryPointPerfiles}`
const URLF = `http://${url}:${port}/${entryPointFollows}`

const resolvers = {
  Query: {
    allPerfiles:(_) => getRequest(`${URLP}/getPerfiles`, ''),
    PerfilById: (_, { id }) => generalRequest(`${URLP}/getPerfil/${id}`, 'GET'),
    getPerfilByIdUsuario:(_) =>generalRequest(`${URLP}/getPerfilByIdUsuario`,'GET'),

    allFollows:(_) => getRequest(`${URLF}/getAllFollows`, ''),
    followdById: (_, { id }) => generalRequest(`${URLF}/getFollows/${id}`, 'GET'),
    getFollowerByIdUsuario:(_) =>generalRequest(`${URLF}/getAllFollowersById`,'GET'),
    getFollowerByIdUsuario:(_) =>generalRequest(`${URLF}/getAllFollowsById`,'GET'),
  },
  Mutation: {
    createPerfil: (_, { perfil }) =>
    generalRequest(`${URLP}/createPerfil/`, 'POST', perfil),
    deletePerfil: (_, { id }) => generalRequest(`${URLP}/deletePerfil/${id}`, 'DELETE'),

    createFollows: (_, { follow }) =>
    generalRequest(`${URLF}/createFollow/`, 'POST', follow),
    deleteFollows: (_, { id }) => generalRequest(`${URLF}/deleteFollows/${id}`, 'DELETE'),
  },
}

export default resolvers
