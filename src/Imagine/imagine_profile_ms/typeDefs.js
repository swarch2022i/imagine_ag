export const profileTypeDef = `
type Perfil {
    id: Int!
    idUsuario: String!
    nombre: String!
    idImagenPerfil: String!
    texto: String
    numfollows : Int
    numfollowers : Int
}
input PerfilInput {
    idUsuario: String!
    nombre: String!
    idImagenPerfil: String!
    texto: String
    numfollows : Int
    numfollowers : Int
}
type Follows {
    id: Int!
    idUsuarioFollower: String!
    nombreFollower: String!
    idUsuarioFollowBy: String!
    nombreFolloweBy: String!
}
input FollowsInput {
    idUsuarioFollower: String!
    nombreFollower: String!
    idUsuarioFollowBy: String!
    nombreFolloweBy: String!
}
`
export const profileQueries = `
allPerfiles: [Perfil]!
PerfilById(id: Int!): Perfil!
getPerfilByIdUsuario(idUsuario: String!): Perfil!

allFollows: [Follows]!
getFollowsByid(id: Int!): Follows!
getAllFollowersById(idFollower: String!): Follows!
getAllFollowById(idFollow: String!): Follows!
`

export const profileMutations = `
createPerfil(perfil: PerfilInput!): Perfil!
putPerfil(id: Int!,perfil: PerfilInput!):Perfil!
deletePerfil(id: Int!): Perfil!

createFollow(follow : FollowsInput!): Follows!
deleteFollows(id: Int!): Follows!
`
