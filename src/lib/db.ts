import mongoose from "mongoose";

type MongoGlobal = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryUri?: string;
};

const globalForMongo = globalThis as typeof globalThis & {
  __orbithireMongo?: MongoGlobal;
};

function mongoCache(): MongoGlobal {
  if (!globalForMongo.__orbithireMongo) {
    globalForMongo.__orbithireMongo = { conn: null, promise: null };
  }
  return globalForMongo.__orbithireMongo;
}

async function resolveUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const cache = mongoCache();
  if (cache.memoryUri) return cache.memoryUri;

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const server = await MongoMemoryServer.create();
  cache.memoryUri = server.getUri();
  return cache.memoryUri;
}

export async function connectDb() {
  const cache = mongoCache();
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = (async () => {
      const uri = await resolveUri();
      mongoose.set("strictQuery", true);
      await mongoose.connect(uri, { dbName: "orbithire" });
      return mongoose;
    })();
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
