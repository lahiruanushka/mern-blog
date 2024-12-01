import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const addToFavorite = async (req, res, next) => {
  try {
    const { postId } = req.body;

    // Validate postId
    if (!postId) {
      return next(errorHandler(400, "Post ID is required"));
    }

    // Find the user and check if post is already in favorites
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // Check if already in favorites
    if (user.favorites.includes(postId)) {
      return res.status(200).json({
        message: "Post already in favorites",
        favorites: user.favorites,
      });
    }

    // Add to favorites
    user.favorites.push(postId);
    await user.save();

    res.status(201).json({
      message: "Post added to favorites successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Validate postId
    if (!postId) {
      return next(errorHandler(400, "Post ID is required"));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if post is in favorites
    const initialFavoritesLength = user.favorites.length;
    user.favorites = user.favorites.filter((id) => id.toString() !== postId);

    // If no favorites were removed
    if (user.favorites.length === initialFavoritesLength) {
      return res.status(404).json({
        message: "Post not found in favorites",
        favorites: user.favorites,
      });
    }

    await user.save();

    res.status(200).json({
      message: "Post removed from favorites successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favorites",
      select: "-__v", // Exclude version key
    });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      message: "Favorites retrieved successfully",
      favorites: user.favorites,
      count: user.favorites.length,
    });
  } catch (error) {
    next(error);
  }
};
