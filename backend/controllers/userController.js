import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import Post from "../models/postModel.js";

export const updateUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  // Ensure username is provided and validate it
  if (
    typeof req.body.username === "undefined" ||
    req.body.username.trim() === ""
  ) {
    return next(errorHandler(400, "Username cannot be empty"));
  }

  if (req.body.username.length < 6 || req.body.username.length > 20) {
    return next(
      errorHandler(400, "Username must be between 6 and 20 characters")
    );
  }

  if (req.body.username.includes(" ")) {
    return next(errorHandler(400, "Username cannot contain spaces"));
  }

  if (req.body.username !== req.body.username.toLowerCase()) {
    return next(errorHandler(400, "Username must be lowercase"));
  }

  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
    return next(
      errorHandler(400, "Username can only contain letters and numbers")
    );
  }

  // Check if the username already exists in the database
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.id !== req.params.id) {
      return next(errorHandler(400, "Username already taken"));
    }
  } catch (error) {
    return next(errorHandler(500, "Error checking username availability"));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getUserProfileByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    }).select(
      "username email profilePicture isVerified accountStatus createdAt favorites"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sanitize further if needed (e.g., hide email)
    const safeUser = {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    res.json(safeUser);
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
