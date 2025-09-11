import express from "express";
import {
  addToFavorite,
  getUserFavorites,
  removeFromFavorites,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a post to favorites
router.post("/add-favorite", protect, addToFavorite);

// Remove a post from favorites
router.delete("/remove-favorite/:postId", protect, removeFromFavorites);

// Get user's favorites
router.get("/get-favorites", protect, getUserFavorites);

export default router;
