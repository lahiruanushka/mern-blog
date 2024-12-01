import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// In-memory store for tracking signup attempts
const signupAttempts = new Map();

// Rate limiting for password reset requests
const resetAttempts = new Map();
const MAX_RESET_ATTEMPTS = 3;
const RESET_WINDOW = 60 * 60 * 1000; // 1 hour

// Clean up old attempts periodically
function cleanupSignupAttempts() {
  const now = Date.now();
  for (const [ip, attempt] of signupAttempts.entries()) {
    if (now - attempt.timestamp > 60 * 60 * 1000) {
      // 1 hour
      signupAttempts.delete(ip);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupSignupAttempts, 60 * 60 * 1000);

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Get client IP (works with proxies)
  const ip =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress;

  // Validate input fields
  if (!username) {
    return next(errorHandler(400, "Username is required"));
  }

  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }

  if (!password) {
    return next(errorHandler(400, "Password is required"));
  }

  // Rate limiting logic
  const now = Date.now();
  const ipAttempt = signupAttempts.get(ip) || { count: 0, timestamp: now };

  // Allow max 5 signup attempts per hour from same IP
  if (ipAttempt.count >= 5) {
    const timeSinceFirstAttempt = now - ipAttempt.timestamp;

    // If more than 5 attempts within an hour, block
    if (timeSinceFirstAttempt < 60 * 60 * 1000) {
      return next(
        errorHandler(429, "Too many signup attempts. Please try again later.")
      );
    }
  }

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email address already exists" });
    }

    // Update signup attempts
    signupAttempts.set(ip, {
      count: ipAttempt.count + 1,
      timestamp: ipAttempt.timestamp || now,
    });

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user
    await newUser.save();

    // Reset signup attempts on successful signup
    signupAttempts.delete(ip);

    res.json({ success: true, message: "Signup Successful" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "Email and password are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return next(errorHandler(423, "Account is locked. Try again later."));
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
        await user.save();
        return next(
          errorHandler(
            423,
            "Account locked due to too many failed attempts. Try again later."
          )
        );
      }

      await user.save();
      return next(errorHandler(400, "Invalid email or password"));
    }

    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  // Check rate limiting
  const attempts = resetAttempts.get(ip) || { count: 0, timestamp: Date.now() };
  if (attempts.count >= MAX_RESET_ATTEMPTS) {
    if (Date.now() - attempts.timestamp < RESET_WINDOW) {
      return next(
        errorHandler(429, "Too many reset attempts. Please try again later.")
      );
    }
    resetAttempts.delete(ip);
  }

  try {
    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    // Don't reveal if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If an account exists, a reset link will be sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store hashed token
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Update rate limiting
    resetAttempts.set(ip, {
      count: attempts.count + 1,
      timestamp: attempts.timestamp,
    });

    // Create reset URL with unguessable token
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Enable TLS
      secure: true,
    });

    const mailOptions = {
      from: `"Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="padding: 10px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 15 minutes for your security.</p>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "If an account exists, a reset link will be sent." });
  } catch (error) {
    console.error("Password reset error:", error);
    return next(
      errorHandler(500, "Could not send reset email. Please try again later.")
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return next(errorHandler(400, "Token and new password are required"));
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return next(
        errorHandler(400, "Password must be at least 8 characters long")
      );
    }

    // Hash the token from the URL
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(errorHandler(400, "Invalid or expired reset token"));
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Clear any failed login attempts
    user.failedAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({
      message:
        "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return next(
      errorHandler(500, "Could not reset password. Please try again.")
    );
  }
};
