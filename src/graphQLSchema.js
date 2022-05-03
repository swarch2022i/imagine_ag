import merge from 'lodash.merge'
import GraphQLJSON from 'graphql-type-json'
import { makeExecutableSchema } from 'graphql-tools'
import { mergeSchemas } from './utilities'

//como debemos importar los typeDef
// import {} from './swarch2022i/imagine_auth_ms/typeDefs';
// import {} from './swarch2022i/imagine_collection_ms/typeDefs';
// import {} from './swarch2022i/imagine_image_ms/typeDefs';
// import {} from './swarch2022i/imagine_network_ms/typeDefs';
// import {} from './swarch2022i/imagine_profile_ms/typeDefs';

//import {
//  categoryMutations,
//  categoryQueries,
//  categoryTypeDef,
//} from './swarch2022i/Imagine/example/typeDefs'
import {
  authMutations,
  authQueries,
  authTypeDef,
} from './Imagine/imagine_auth_ms/typeDefs'

//como debemos importar los resolvers
// import authResolvers from './swarch2022i/imagine_auth_ms/resolvers';
// import collectionResolvers from './swarch2022i/imagine_collection_ms/resolvers';
// import imageResolvers from './swarch2022i/imagine_image_ms/resolvers';
// import networkResolvers from './swarch2022i/imagine_network_ms/resolvers';
// import profileResolvers from './swarch2022i/imagine_profile_ms/resolvers';

import authResolvers from './Imagine/imagine_auth_ms/resolvers'

// merge the typeDefs -- esto nos toca con cada typeDefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', authTypeDef],
  [authQueries],
  [authMutations],
)

// Generate the schema object from your types definition. -- lomismo la enfermedad del lomo :v
export default makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge(
    { JSON: GraphQLJSON }, // allows scalar JSON
    authResolvers,
  ),
})
