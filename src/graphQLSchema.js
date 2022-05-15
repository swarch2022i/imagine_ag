import merge from 'lodash.merge'
import GraphQLJSON from 'graphql-type-json'
import { makeExecutableSchema } from 'graphql-tools'
import { mergeSchemas } from './utilities'

//Mutations, Queries and TypeDefs imports
import {
  imageMutations,
  imageQueries,
  imageTypeDef,
} from './Imagine/imagine_image_ms/typeDefs'
import {
  imageStorageMutations,
  imageStorageQueries,
  imageStorageTypeDef,
} from './Imagine/imagine_storage_ms/typeDefs'
import {
  commentQueries,
  commentTypeDef,
  commentMutations,
} from './Imagine/imagine_network_ms/comments/typeDefs'
import {
  voteQueries,
  voteTypeDef,
  voteMutations,
} from './Imagine/imagine_network_ms/votes/typeDefs'
import {
  userTypeDef,
  responseTypeDef,
  collectionsTypeDef,
  collectionsQueries,
  collectionsMutations,
  userMutations,
} from './Imagine/imagine_collection_ms/typeDefs';
import{
  profileMutations,
  profileQueries,
  profileTypeDef,
} from './Imagine/imagine_profile_ms/typeDefs'
import {
  authMutations,
  authQueries,
  authTypeDef,
} from './Imagine/imagine_auth_ms/typeDefs'

//Resolvers imports
import imageResolvers from './Imagine/imagine_image_ms/resolvers'
import imageStorageResolvers from './Imagine/imagine_storage_ms/resolvers'
import collectionResolvers from './Imagine/imagine_collection_ms/resolvers';
import commentResolvers from './Imagine/imagine_network_ms/comments/resolvers'
import voteResolvers from './Imagine/imagine_network_ms/votes/resolvers'
import profileResolvers from './Imagine/imagine_profile_ms/resolvers'
import authResolvers from './Imagine/imagine_auth_ms/resolvers'

// Merge mutations, queries and typdefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', imageTypeDef, imageStorageTypeDef, userTypeDef, collectionsTypeDef, responseTypeDef,commentTypeDef,
  voteTypeDef,profileTypeDef, authTypeDef],
  [imageQueries, imageStorageQueries, collectionsQueries,commentQueries, voteQueries,profileQueries, authQueries],
  [imageMutations, imageStorageMutations, collectionsMutations, userMutations,commentMutations, voteMutations,profileMutations, authMutations],
)

// Generate Schema with all above and resolvers
export default makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge({ JSON: GraphQLJSON }, // allows scalar JSON
    // categoryResolvers,
    imageResolvers,
    imageStorageResolvers,
    collectionResolvers,
    commentResolvers,
    voteResolvers,
    profileResolvers,
    authResolvers
  ),
})
