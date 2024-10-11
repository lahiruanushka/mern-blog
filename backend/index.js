import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { handleError } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://http://localhost:5173/",
  credentials: true, // Enable credentials if cookies are used
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if connection fails
  });

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error-handling middleware
app.use(handleError);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
