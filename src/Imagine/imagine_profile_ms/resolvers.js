import { generalRequest, getRequest } from '../../utilities'
import { url, port, entryPoint } from './server'

const URL = `http://${url}:${port}/${entryPoint}`

const resolvers = {
  Query: {
    allPerfiles:(_) => getRequest(`${URL}/getPerfiles`, ''),
    PerfilById: (_, { id }) => generalRequest(`${URL}/getPerfil/${id}`, 'GET'),
  },
  Mutation: {
    createPerfil: (_, { perfil }) =>
    generalRequest(`${URL}/createPerfil/`, 'POST', perfil),
  },
}

export default resolvers
