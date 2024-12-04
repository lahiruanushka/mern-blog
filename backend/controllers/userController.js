import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Otp from "../models/otpModel.js";
import zxcvbn from 'zxcvbn';
import generatePasswordFeedback from "../utils/generatePasswordFeedback.js";

export const test = (req, res) => {
  res.json({ message: "API is working" });
};

export const requestPasswordUpdateOTP = async (req, res, next) => {
  const { currentPassword } = req.body;

  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Verify current password first
    const isCurrentPasswordCorrect = await bcryptjs.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      return next(errorHandler(400, "Current password is incorrect"));
    }

    // Generate 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Remove any existing OTP for this user
    await Otp.deleteMany({ user: user._id });

    // Create and save new OTP
    const newOtp = new Otp({
      user: user._id,
      otp: otpCode,
      expiry: otpExpiry
    });
    await newOtp.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Update OTP",
      text: `Your OTP for password update is: ${otpCode}. 
             This OTP will expire in 15 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  const { currentPassword, newPassword, otp } = req.body;

  try {
    console.log('Password Update Request:', { 
      userId: req.user.id, 
      currentPasswordProvided: !!currentPassword,
      otpProvided: !!otp
    });

    // Find the user with the full document to access the password
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      console.error('User not found');
      return next(errorHandler(404, "User not found"));
    }

    // More robust password verification
    const isCurrentPasswordCorrect = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordCorrect) {
      console.error('Current password incorrect');
      return next(errorHandler(400, "Current password is incorrect"));
    }

    // Verify OTP
    const storedOTP = await Otp.findOne({ 
      user: user._id, 
      otp: otp,
      expiry: { $gt: new Date() } 
    });

    if (!storedOTP) {
      console.error('Invalid or expired OTP');
      return next(errorHandler(400, "Invalid or expired OTP"));
    }

    // Password strength validation using zxcvbn
    const strengthResult = zxcvbn(newPassword);
    
    // Comprehensive password validation
    const passwordValidationErrors = [];

    // Minimum strength threshold (you can adjust this)
    if (strengthResult.score < 2) {
      const strengthFeedback = generatePasswordFeedback(strengthResult);
      passwordValidationErrors.push(strengthFeedback);
    }

    // Additional custom validation rules (optional)
    // Minimum length
    if (newPassword.length < 8) {
      passwordValidationErrors.push(
        "Password must be at least 8 characters long"
      );
    }

    // Prevent reusing the current password
    const isNewPasswordSameAsCurrent = await bcryptjs.compare(
      newPassword,
      user.password
    );
    if (isNewPasswordSameAsCurrent) {
      passwordValidationErrors.push(
        "New password cannot be the same as the current password"
      );
    }

    // If there are any validation errors, return them
    if (passwordValidationErrors.length > 0) {
      console.error('Password validation failed:', passwordValidationErrors);
      return next(errorHandler(400, passwordValidationErrors.join(". ")));
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    // Remove the used OTP
    await Otp.deleteOne({ _id: storedOTP._id });

    console.log('Password updated successfully');
    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error('Password update error:', error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
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
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
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
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
