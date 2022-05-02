import merge from 'lodash.merge'
import GraphQLJSON from 'graphql-type-json'
import { makeExecutableSchema } from 'graphql-tools'
import { mergeSchemas } from './utilities'



//Mutations, Queries and TypeDefs imports
import { imageMutations, imageQueries, imageTypeDef, } from './Imagine/imagine_image_ms/typeDefs'
import { imageStorageMutations, imageStorageQueries, imageStorageTypeDef } from './Imagine/imagine_storage_ms/typeDefs'
import {userTypeDef,collectionsTypeDef,collectionsQueries,collectionsMutations,userMutations,responseTypeDef} from './Imagine/imagine_collection_ms/typeDefs'

//Resolvers imports
import imageResolvers from './Imagine/imagine_image_ms/resolvers';
import imageStorageResolvers from './Imagine/imagine_storage_ms/resolvers'
import collectionResolvers from './Imagine/imagine_collection_ms/resolvers';



// Merge mutations, queries and typdefs
const mergedTypeDefs = mergeSchemas(

  ['scalar JSON', imageTypeDef, imageStorageTypeDef, userTypeDef, collectionsTypeDef, responseTypeDef,], 
  [imageQueries, imageStorageQueries, collectionsQueries,], 
  [imageMutations, imageStorageMutations,collectionsMutations, userMutations,],

)


// Generate Schema with all above and resolvers
export default makeExecutableSchema({
  typeDefs: mergedTypeDefs,

  resolvers: merge({ JSON: GraphQLJSON }, // allows scalar JSON
    // categoryResolvers,
    imageResolvers,
    imageStorageResolvers,
    collectionResolvers


  ),
})