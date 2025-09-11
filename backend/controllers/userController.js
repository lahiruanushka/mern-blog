import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import Post from "../models/postModel.js";

/**
 * @desc    Update a user by ID (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update users"));
  }

  // Validate username
  if (!req.body.username || req.body.username.trim() === "") {
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
  if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
    return next(
      errorHandler(400, "Username can only contain letters and numbers")
    );
  }

  // Ensure username is unique
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
    res.status(200).json({ success: true, data: rest });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user by ID (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete users"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (paginated) (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
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
      success: true,
      data: {
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see this user"));
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json({ success: true, data: rest });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a user profile by username (public)
 * @route   GET /api/users/user/:username
 * @access  Public
 */
export const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.toLowerCase().trim(),
    }).select(
      "firstName lastName username profilePicture isVerified createdAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(user);

    // Only return safe fields
    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    res.json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all posts by a user ID
 * @route   GET /api/users/:id/posts
 * @access  Public
 */
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

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};
