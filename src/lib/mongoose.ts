import mongoose from "mongoose";

// Cache connection across hot reloads in development
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("MongoDB URL not found");
  }

  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise exists, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
      socketTimeoutMS: 10000, // 10 second socket timeout
      connectTimeoutMS: 5000, // 5 second connection timeout
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URL, opts)
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
};
