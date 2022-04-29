import merge from 'lodash.merge'
import GraphQLJSON from 'graphql-type-json'
import { makeExecutableSchema } from 'graphql-tools'
import { mergeSchemas } from './utilities'

//como debemos importar los typeDef
// import {} from './Imagine/imagine_auth_ms/typeDefs';
// import {} from './Imagine/imagine_collection_ms/typeDefs';
// import {} from './Imagine/imagine_image_ms/typeDefs';
import {
  commentQueries,
  commentTypeDef,
  commentMutations,
} from './Imagine/imagine_network_ms/typeDefs'

// import {} from './Imagine/imagine_profile_ms/typeDefs';

import {
  categoryMutations,
  categoryQueries,
  categoryTypeDef,
} from './Imagine/example/typeDefs'

//como debemos importar los resolvers
// import authResolvers from './Imagine/imagine_auth_ms/resolvers';
// import collectionResolvers from './Imagine/imagine_collection_ms/resolvers';
// import imageResolvers from './Imagine/imagine_image_ms/resolvers';
import networkResolvers from './Imagine/imagine_network_ms/resolvers'
// import profileResolvers from './Imagine/imagine_profile_ms/resolvers';

import categoryResolvers from './Imagine/example/resolvers'

// merge the typeDefs -- esto nos toca con cada typeDefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', categoryTypeDef, commentTypeDef],
  [commentQueries, categoryQueries],
  [commentMutations, categoryMutations],
)

// Generate the schema object from your types definition. -- lomismo la enfermedad del lomo :v
export default makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge([
    { JSON: GraphQLJSON }, // allows scalar JSON
    categoryResolvers,
    networkResolvers,
  ]),
})
