import mongoose from "mongoose";

let connectionPromise;

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI is missing");

  if (mongoose.connection.readyState === 1) return;
  if (connectionPromise && mongoose.connection.readyState === 2) {
    await connectionPromise;
    return;
  }

  connectionPromise = mongoose.connect(uri);
  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }

  console.log("MongoDB connected");
}
