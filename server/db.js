import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hc_insights_db";

export let isConnectedToMongo = false;
export let isUsingEmbeddedMock = false;

// Embedded Mock Database for instant zero-config fallback
export const mockDB = {
  patients: [],
  encounters: [],
  claims: [],
  campaigns: [],
  actions: [],
  auditLogs: [],
};

export async function connectDB() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnectedToMongo = true;
    console.log(`[MongoDB] Successfully connected to live database at ${MONGO_URI}`);
  } catch (err) {
    isConnectedToMongo = false;
    isUsingEmbeddedMock = true;
    console.log(`[MongoDB] Live Mongo server not detected (${err.message}). Defaulting to Mock In-Memory Database Service.`);
  }
}
