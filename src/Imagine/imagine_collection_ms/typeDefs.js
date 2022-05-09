export const userTypeDef = `
	type user {
		uuid: String!
	}

	input userInput {
		uuid: String!
	}
`;

export const responseTypeDef = `
	type response {
		status: String!
		rows: Int
		data: [collection]
		collection: collection
		error: String
		message: String
		uuid: String
	}
`;

export const collectionsTypeDef = `
	type collection {
		images_ids: [String!]!
		description: String!
	}

	input image {
		uuid: String
	}
	
	input collectionInput {
		uuid: String!
		images_ids: [String!]!
		description: String
	}

	input collectionInputPatch {
		uuid: String!
		images_ids: [image]
		description: String
	}
`;

export const collectionsQueries = `
	collectionInfo(uuid: String!): response!
	userCollections(uuid: String!): response!
`;

export const collectionsMutations = `
	createCollection(collection: collectionInput!): response!
	updateCollection(collection: collectionInputPatch!): response!
	deleteCollection(uuid: String!): response!
	deleteImage(uuid: String!): response!
`;

export const userMutations = `
	createUser(uuid: String!): response!
`;