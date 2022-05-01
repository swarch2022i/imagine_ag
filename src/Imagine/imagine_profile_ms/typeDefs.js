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
type Follows {
    id: Int!
    idUsuarioFollower: Int!
    nombreFollower: String!
    idUsuarioFollowBy: Int!
    nombreFolloweBy: String!
}
input FollowsInput {
    idUsuarioFollower: Int!
    nombreFollower: String!
    idUsuarioFollowBy: Int!
    nombreFolloweBy: String!
}
`
export const perfilQueries = `
allPerfiles: [Perfil]!
PerfilById(id: Int!): Perfil!
getPerfilByIdUsuario(idUsuario: String!): Perfil!

allFollows: [Follows]!
getFollowsByid(id: Int!): Follows!
getAllFollowersById(idFollower: String!): Follows!
getAllFollowById(idFollow: String!): Follows!
`

export const perfilyMutations = `
createPerfil(perfil: PerfilInput!): Perfil!
putPerfil(id: Int!,perfil: PerfilInput!):Perfil!
deletePerfil(id: Int!): Perfil!

createFollow(follow : FollowsInput!): Follows!
deleteFollows(id: Int!): Follows!
`
