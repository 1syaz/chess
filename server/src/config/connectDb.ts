import mongoose from "mongoose";
import config from "./config";

export async function connectDb(): Promise<void> {
  try {
    const connectionInstance = await mongoose.connect(config.MONGO_URI);

    console.log("Connected to Mongodb", connectionInstance.connection.host);
  } catch (error) {
    console.log("Mongodb Connection Error", error);
    process.exit(1);
  }
}
