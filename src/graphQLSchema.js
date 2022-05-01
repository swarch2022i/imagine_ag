import merge from 'lodash.merge'
import GraphQLJSON from 'graphql-type-json'
import { makeExecutableSchema } from 'graphql-tools'
import { mergeSchemas } from './utilities'


//Mutations, Queries and TypeDefs imports
import { imageMutations, imageQueries, imageTypeDef, } from './Imagine/imagine_image_ms/typeDefs';
import { imageStorageMutations, imageStorageQueries, imageStorageTypeDef } from './Imagine/imagine_storage_ms/typeDefs'


//Resolvers imports
import imageResolvers from './Imagine/imagine_image_ms/resolvers';
import imageStorageResolvers from './Imagine/imagine_storage_ms/resolvers'



// Merge mutations, queries and typdefs
const mergedTypeDefs = mergeSchemas(
  ['scalar JSON', imageTypeDef, imageStorageTypeDef], [imageQueries, imageStorageQueries], [imageMutations, imageStorageMutations],
)


// Generate Schema with all above and resolvers
export default makeExecutableSchema({
  typeDefs: mergedTypeDefs,
  resolvers: merge({ JSON: GraphQLJSON }, // allows scalar JSON
    // categoryResolvers,
    imageResolvers,
    imageStorageResolvers
  ),
})