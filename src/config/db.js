// src/config/db.js
import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

export const connectToMongoDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB Connected: ${connectionInstance.connection.host}/${DB_NAME}`
    );
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
