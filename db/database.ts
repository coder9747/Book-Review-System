import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.database_url || "");
    console.log("Database Connected Succesfully");
  } catch (error) {
    console.log(error);
    throw new Error("Failed To Connect To Database");
    process.exit(1);
  }
};
