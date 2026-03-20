import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();
const SRV_LOOKUP_ERROR_PATTERN = /querySrv ECONNREFUSED|_mongodb\._tcp/i;
const NETWORK_ERROR_PATTERN =
  /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|timed out|Topology is closed/i;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export function isMongoConfigured() {
  return Boolean(MONGODB_URI);
}

export function getMongoErrorMessage(
  error: unknown,
  fallbackMessage = 'Database error.'
) {
  if (error instanceof Error) {
    if (error.message.includes('MONGODB_URI is not defined')) {
      return 'MongoDB is not configured on the server.';
    }

    if (SRV_LOOKUP_ERROR_PATTERN.test(error.message)) {
      return 'MongoDB DNS SRV lookup failed on this machine. Use a non-SRV mongodb:// URI with host1,host2,host3 in MONGODB_URI.';
    }

    if (
      error.name === 'MongoNetworkError' ||
      error.name === 'MongoServerSelectionError' ||
      NETWORK_ERROR_PATTERN.test(error.message)
    ) {
      return 'Could not connect to MongoDB.';
    }
  }

  if (error instanceof mongoose.Error) {
    return 'Database error.';
  }

  return fallbackMessage;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
