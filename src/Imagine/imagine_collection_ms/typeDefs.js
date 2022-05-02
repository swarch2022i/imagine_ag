export const userTypeDef = `
	type user {
		uid: String!
	}

	input userInput {
		uid: String!
	}
`;

export const responseTypeDef = `
	type response {
		status: String!
		rows: Int
		data: [collection]
		collection: collection
		error: String
	}
`;

export const collectionsTypeDef = `
	type collection {
		uid: String!
		images_ids: [String!]!
		description: String!
	}

	input collectionsInput {
		uid: String!
		images_ids: [String!]!
		description: String!
	}
`;

export const collectionsQueries = `
	collection(uid: String!): response!
	userCollections(uid: String!): response!
`;

export const collectionsMutations = `
	createCollection(collection: collectionsInput!): response!
	updateCollection(uid_owner: String!, uid_collection: String!, description: String, images_ids: [String]): response!
	deleteCollection(uid: String!): response!
`
export const userMutations = `
	createUser(user: userInput!): response!
`;