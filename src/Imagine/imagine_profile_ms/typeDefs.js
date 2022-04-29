export const perfilTypeDef = `
type Perfil {
    id: Int!
    idUsuario: Int!
    nombre: String!
    idImagenPerfil: String!
    texto: String!
    numfollows : Int!
    numfollowers : Int!
}
input PerfilInput {
    idUsuario: Int!
    nombre: String!
    idImagenPerfil: String!
    texto: String!
    numfollows : Int!
    numfollowers : Int!
}
`
export const perfilQueries = `
allPerfiles: [Perfil]!
PerfilById(id: Int!): Perfil!
`

export const perfilyMutations = `
createPerfil(perfil: PerfilInput!): Perfil!
`
