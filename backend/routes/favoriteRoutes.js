import express from "express";
import {
  addToFavorite,
  getUserFavorites,
  removeFromFavorites,
} from "../controllers/favoriteController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Add a post to favorites
router.post("/add-favorite", verifyToken, addToFavorite);

// Remove a post from favorites
router.delete("/remove-favorite/:postId", verifyToken, removeFromFavorites);

// Get user's favorites
router.get("/get-favorites", verifyToken, getUserFavorites);

export default router;
