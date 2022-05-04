import { generalRequest, getRequest } from '../../utilities'
import { urlProfile,entryPointPerfiles, entryPointFollows } from './server'

const URLP = `http://${urlProfile}/${entryPointPerfiles}`
const URLF = `http://${urlProfile}/${entryPointFollows}`

const resolvers = {
  Query: {
    allPerfiles:(_) => getRequest(`${URLP}/getPerfiles`, ''),
    PerfilById: (_, { id }) => generalRequest(`${URLP}/getPerfil/${id}`, 'GET'),
    getPerfilByIdUsuario:(_, { idUsuario }) =>generalRequest(`${URLP}/getPerfilByIdUsuario/${idUsuario}`,'GET'),

    allFollows:(_) => getRequest(`${URLF}/getAllFollows`, ''),
    getFollowsByid: (_, { id }) => generalRequest(`${URLF}/getFollows/${id}`, 'GET'),
    getAllFollowersById:(_, { idUsuario }) =>generalRequest(`${URLF}/getAllFollowersById/${idUsuario}`,'GET'),
    getAllFollowById:(_, { idUsuario }) =>generalRequest(`${URLF}/getAllFollowsById/${idUsuario}`,'GET'),
  },
  Mutation: {
    createPerfil: (_, { perfil }) =>
    generalRequest(`${URLP}/createPerfil/`, 'POST', perfil),
    deletePerfil: (_, { id }) => generalRequest(`${URLP}/deletePerfil/${id}`, 'DELETE'),
    updatePerfil: (_, { id, perfil }) =>
    generalRequest(`${URLP}/putPerfil/${id}`, 'PUT', perfil),

    createFollow: (_, { follow }) =>
    generalRequest(`${URLF}/createFollow/`, 'POST', follow),
    deleteFollows: (_, { id }) => generalRequest(`${URLF}/deleteFollows/${id}`, 'DELETE'),
  },
}

export default resolvers
