import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
	throw new Error('MONGODB_URI is required. Please add it to your .env.local file');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	let globalWithMongo = global as typeof globalThis & {
		_mongoClientPromise?: Promise<MongoClient>;
	};

	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri, options);
		globalWithMongo._mongoClientPromise = client.connect();
	}
	clientPromise = globalWithMongo._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export default clientPromise;

export const getDatabase = async (): Promise<Db> => {
	try {
		const client = await clientPromise;
		return client.db('stowarzyszenie_mloda_sila');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw new Error(
			'Failed to connect to MongoDB. Please check your connection string in .env.local'
		);
	}
};
