import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "API is working" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // Ensure username is provided and validate it
  if (typeof req.body.username === 'undefined' || req.body.username.trim() === '') {
    return next(errorHandler(400, "Username cannot be empty"));
  }

  if (req.body.username.length < 6 || req.body.username.length > 20) {
    return next(errorHandler(400, "Username must be between 6 and 20 characters"));
  }

  if (req.body.username.includes(" ")) {
    return next(errorHandler(400, "Username cannot contain spaces"));
  }

  if (req.body.username !== req.body.username.toLowerCase()) {
    return next(errorHandler(400, "Username must be lowercase"));
  }

  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
    return next(errorHandler(400, "Username can only contain letters and numbers"));
  }

  // Check if the username already exists in the database
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.id !== req.params.userId) {
      return next(errorHandler(400, "Username already taken"));
    }
  } catch (error) {
    return next(errorHandler(500, "Error checking username availability"));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
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
