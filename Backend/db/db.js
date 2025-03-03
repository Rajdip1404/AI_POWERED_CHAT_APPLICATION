import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";



function connectDB() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => {
        console.log(error);
      });
}

export default connectDB;