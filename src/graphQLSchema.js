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

//Resolvers imports
import imageResolvers from './Imagine/imagine_image_ms/resolvers'
import imageStorageResolvers from './Imagine/imagine_storage_ms/resolvers'
import commentResolvers from './Imagine/imagine_network_ms/comments/resolvers'
import voteResolvers from './Imagine/imagine_network_ms/votes/resolvers'

// Merge mutations, queries and typdefs
const mergedTypeDefs = mergeSchemas(
  [
    'scalar JSON',
    imageTypeDef,
    imageStorageTypeDef,
    commentTypeDef,
    voteTypeDef,
  ],
  [imageQueries, imageStorageQueries, commentQueries, voteQueries],
  [imageMutations, imageStorageMutations, commentMutations, voteMutations],
)

// Generate Schema with all above and resolvers
export default makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge(
    { JSON: GraphQLJSON }, // allows scalar JSON
    imageResolvers,
    imageStorageResolvers,
    commentResolvers,
    voteResolvers,
  ),
})
