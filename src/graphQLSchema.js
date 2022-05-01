import merge from 'lodash.merge'
import GraphQLJSON from 'graphql-type-json'
import { makeExecutableSchema } from 'graphql-tools'
import { mergeSchemas } from './utilities'

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

import networkResolvers from './Imagine/imagine_network_ms/comments/resolvers'
import voteResolvers from './Imagine/imagine_network_ms/votes/resolvers'

// merge the typeDefs -- esto nos toca con cada typeDefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', commentTypeDef, voteTypeDef],
  [commentQueries, voteQueries],
  [commentMutations, voteMutations],
)

// Generate the schema object from your types definition. -- lomismo la enfermedad del lomo :v
export default makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge([
    { JSON: GraphQLJSON }, // allows scalar JSON
    networkResolvers,
    voteResolvers,
  ]),
})
