import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT | 8000;

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is connceted"))
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
