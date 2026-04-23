// src/config/db.js
import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

console.log("db url ", process.env.MONGO_URI);

const connectToMongoDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
    );
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectToMongoDB;
