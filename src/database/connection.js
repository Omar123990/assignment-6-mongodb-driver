import { MongoClient } from "mongodb";
import { env } from "../config/env.service.js";

const client = new MongoClient(env.databaseUri);

export const databaseConection = async () => {
  try {
    await client.connect();
    console.log("Database connected successfully");
    return client.db("assignment-6");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
