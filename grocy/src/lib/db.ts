import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cache.conn) {
    return cache.conn; // Use existing connection, we are already connected. Don't create a new connection.
  }

  // if we have no cache and no promise, create a new connection
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(mongodbUri)
      .then((conn) => conn.connection);
  }

  //But we have a promise to connect, wait for it
  try {
    const conn = await cache.promise;
    return conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
