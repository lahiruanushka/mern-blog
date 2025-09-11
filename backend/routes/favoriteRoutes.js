import express from "express";
import {
  addToFavorite,
  removeFromFavorites,
  getFavoritePosts,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a post to favorites
router.post("/", protect, addToFavorite);

// Remove a post from favorites
router.delete("/:postId", protect, removeFromFavorites);

// Get user's favorites
router.get("/", protect, getFavoritePosts);

export default router;
