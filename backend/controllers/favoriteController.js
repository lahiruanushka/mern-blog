import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const addToFavorite = async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return next(errorHandler(400, "Post ID is required"));
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // Add postId only if it's not already in favorites
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: postId } }, // prevents duplicates
      { new: true }
    ).populate("favorites", "-__v");

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(201).json({
      success: true,
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

    if (!postId) {
      return next(errorHandler(400, "Post ID is required"));
    }

    // Remove postId if it exists
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: postId } },
      { new: true }
    ).populate("favorites", "-__v");

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "Post removed from favorites successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavoritePosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favorites",
      select: "-__v",
    });

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      favorites: user.favorites,
      count: user.favorites.length,
    });
  } catch (error) {
    next(error);
  }
};
