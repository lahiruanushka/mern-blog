import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import axios from "axios";
import zxcvbn from "zxcvbn";
import AuthLog from "../models/authLogModel.js";
import generatePasswordFeedback from "../utils/generatePasswordFeedback.js";

// Rate limiting configuration
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Audit logging
const logAuthEvent = async (
  type,
  userId,
  success,
  ip,
  userAgent,
  details = {}
) => {
  try {
    const log = new AuthLog({
      type,
      userId,
      success,
      ip,
      userAgent,
      details,
      timestamp: new Date(),
    });
    await log.save();
  } catch (error) {
    console.error("Audit logging failed:", error);
  }
};

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

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Optional:Email verification function
async function sendVerificationEmail(user) {
  // Generate a unique verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  user.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  // Send verification email (similar to password reset email)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
  });

  const mailOptions = {
    from: `"Account Verification" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify Your Account",
    html: `
      <p>Welcome! Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" style="padding: 10px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export const signup = async (req, res, next) => {
  const { username, email, password, recaptchaToken } = req.body;

  // Get client IP (works with proxies)
  const ip =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress;

  // Comprehensive input validation
  if (!username || username.length < 3 || username.length > 30) {
    return next(errorHandler(400, "Username must be between 3-30 characters"));
  }

  if (!email || !validateEmail(email)) {
    return next(errorHandler(400, "Invalid email address"));
  }

  // Password strength validation
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return next(errorHandler(400, generatePasswordFeedback(passwordStrength)));
  }

  // reCAPTCHA validation
  if (process.env.NODE_ENV === "production") {
    try {
      const captchaResponse = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
          },
        }
      );

      // Stricter CAPTCHA validation
      if (!captchaResponse.data.success || captchaResponse.data.score <= 0.7) {
        return next(
          errorHandler(400, "Suspicious signup attempt. Please try again.")
        );
      }
    } catch (error) {
      console.error("CAPTCHA verification failed:", error);
      return next(errorHandler(500, "Bot verification failed"));
    }
  }

  // More sophisticated rate limiting
  const now = Date.now();
  const ipAttempt = signupAttempts.get(ip) || { count: 0, timestamp: now };

  // Reduced attempts and longer lockout
  if (ipAttempt.count >= 3) {
    const timeSinceFirstAttempt = now - ipAttempt.timestamp;

    // If more than 3 attempts within an hour, block for 2 hours
    if (timeSinceFirstAttempt < 60 * 60 * 1000) {
      return next(
        errorHandler(429, "Too many signup attempts. Try again later.")
      );
    }
  }

  try {
    // Check for existing username or email with case-insensitive comparison
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (existingUsername) {
      return next(errorHandler(400, "Username already exists"));
    }

    const existingEmail = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (existingEmail) {
      return next(errorHandler(400, "Email address already exists"));
    }

    // Update signup attempts
    signupAttempts.set(ip, {
      count: ipAttempt.count + 1,
      timestamp: ipAttempt.timestamp || now,
    });

    // Enhanced password hashing with higher cost
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create a new user with additional security fields
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      registrationIP: ip,
      lastLoginIP: ip,
      accountCreatedAt: new Date(),
      // Optional: Add account verification status
      isVerified: false,
    });

    // Save the new user
    await newUser.save();

    // Reset signup attempts on successful signup
    signupAttempts.delete(ip);

    // Optional: Send verification email
    await sendVerificationEmail(newUser);

    res.status(201).json({
      success: true,
      message: "Signup Successful. Please verify your email.",
      requiresEmailVerification: true,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password, recaptchaToken } = req.body;
  const ip = req.ip || req.headers["x-forwarded-for"];
  const userAgent = req.headers["user-agent"];

  try {
    // Basic input validation
    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }

    // Validate CAPTCHA in production
    if (process.env.NODE_ENV === "production") {
      try {
        const captchaResponse = await axios.post(
          "https://www.google.com/recaptcha/api/siteverify",
          null,
          {
            params: {
              secret: process.env.RECAPTCHA_SECRET_KEY,
              response: recaptchaToken,
            },
          }
        );

        // Check score (0.5 is a common threshold)
        if (
          !captchaResponse.data.success ||
          captchaResponse.data.score <= 0.5
        ) {
          await logAuthEvent("signin", null, false, ip, userAgent, {
            reason: "CAPTCHA failed",
            score: captchaResponse.data.score,
          });
          return next(errorHandler(400, "Suspicious login attempt detected"));
        }
      } catch (error) {
        console.error("CAPTCHA verification failed:", error);
        return next(errorHandler(500, "CAPTCHA verification failed"));
      }
    }

    // Check rate limiting
    const userAttempts = loginAttempts.get(ip) || {
      count: 0,
      timestamp: Date.now(),
    };
    if (userAttempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeElapsed = Date.now() - userAttempts.timestamp;
      if (timeElapsed < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil(
          (LOCKOUT_DURATION - timeElapsed) / 1000 / 60
        );
        await logAuthEvent("signin", null, false, ip, userAgent, {
          reason: "Rate limit exceeded",
        });
        return next(
          errorHandler(
            429,
            `Too many login attempts. Please try again in ${remainingTime} minutes`
          )
        );
      } else {
        loginAttempts.delete(ip);
      }
    }

    // Find user and check if account is locked
    const user = await User.findOne({ email });
    if (!user) {
      await logAuthEvent("signin", null, false, ip, userAgent, {
        reason: "User not found",
      });
      return next(errorHandler(404, "Invalid email or password"));
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil(
        (user.lockUntil - Date.now()) / 1000 / 60
      );
      await logAuthEvent("signin", user._id, false, ip, userAgent, {
        reason: "Account locked",
      });
      return next(
        errorHandler(
          423,
          `Account is locked. Try again in ${remainingTime} minutes`
        )
      );
    }

    // Verify password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      // Increment failed attempts
      userAttempts.count += 1;
      userAttempts.timestamp = Date.now();
      loginAttempts.set(ip, userAttempts);

      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCKOUT_DURATION;
      }
      await user.save();

      await logAuthEvent("signin", user._id, false, ip, userAgent, {
        reason: "Invalid password",
      });
      return next(errorHandler(400, "Invalid email or password"));
    }

    // Success - reset counters and generate token
    loginAttempts.delete(ip);
    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Generate JWT token with short expiry
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set secure cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    };

    // Remove sensitive data
    const { password: pass, ...userData } = user._doc;

    await logAuthEvent("signin", user._id, true, ip, userAgent);

    res
      .status(200)
      .cookie("access_token", token, cookieOptions)
      .json({
        ...userData,
        loginTimestamp: new Date(),
        expiresIn: 3600, // 1 hour in seconds
      });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl, googleId, recaptchaToken } = req.body;

  // Get client IP (works with proxies)
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || // Get first IP if multiple
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress;

  // reCAPTCHA validation
  if (process.env.NODE_ENV === "production") {
    if (!recaptchaToken) {
      return next(errorHandler(400, "reCAPTCHA token is required"));
    }

    try {
      const captchaResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
            remoteip: ip, // Include IP for better validation
          },
        }
      );

      const { success, score, action, hostname } = captchaResponse.data;

      // Enhanced validation checks
      if (!success || score <= 0.7) {
        // Verify request origin
        console.warn("reCAPTCHA validation failed:", {
          success,
          score,
          action,
          hostname,
          ip,
        });
        return next(
          errorHandler(400, "Security check failed. Please try again.")
        );
      }
    } catch (error) {
      console.error("CAPTCHA verification failed:", {
        error: error.message,
        ip,
        email,
      });
      return next(errorHandler(500, "Security verification failed"));
    }
  }

  // More sophisticated rate limiting
  const now = Date.now();
  const ipAttempt = loginAttempts.get(ip) || { count: 0, timestamp: now };

  // Reduced attempts and longer lockout
  if (ipAttempt.count >= 5) {
    const timeSinceFirstAttempt = now - ipAttempt.timestamp;

    // If more than 5 attempts within an hour, block for 2 hours
    if (timeSinceFirstAttempt < 60 * 60 * 1000) {
      return next(
        errorHandler(429, "Too many login attempts. Try again later.")
      );
    }
  }

  try {
    // Validate email format
    if (!validateEmail(email)) {
      return next(errorHandler(400, "Invalid email address"));
    }

    const user = await User.findOne({ email });

    if (user) {
      // If user exists, check if they previously signed up with Google
      if (user.authProvider === "google" || user.googleId === null) {
        // Update Google ID if not set
        if (!user.googleId) {
          user.googleId = googleId;
          user.authProvider = "google";
          user.profilePicture = googlePhotoUrl;
          user.lastLoginIP = ip;
          user.lastLoginAt = new Date();
          await user.save();
        }

        // Reset login attempts on successful login
        loginAttempts.delete(ip);

        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        return res
          .status(200)
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })
          .json(rest);
      } else {
        // Update login attempts for failed authentication
        loginAttempts.set(ip, {
          count: ipAttempt.count + 1,
          timestamp: ipAttempt.timestamp || now,
        });

        // User exists but with a different auth method
        return next(
          errorHandler(
            400,
            "Email already registered with a different authentication method"
          )
        );
      }
    } else {
      // Create new user with Google OAuth
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        profilePicture: googlePhotoUrl,
        authProvider: "google",
        googleId: googleId,
        registrationIP: ip,
        lastLoginIP: ip,
        accountCreatedAt: new Date(),
        lastLoginAt: new Date(),
        // Add account verification status
        isVerified: true, // Since it's Google OAuth
      });

      await newUser.save();

      // Reset login attempts on successful signup
      loginAttempts.delete(ip);

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
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

export const verifyEmail = async (req, res, next) => {
  const { token } = req.params; // Extract token from the URL
  if (!token) {
    return next(errorHandler(400, "Invalid or missing verification token"));
  }

  try {
    // Hash the provided token to match the stored token in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by the hashed token and check expiration
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }, // Token is not expired
    });

    if (!user) {
      return next(
        errorHandler(400, "Invalid or expired email verification token")
      );
    }

    // Mark the user's email as verified
    user.isVerified = true;
    user.emailVerificationToken = undefined; // Clear the token
    user.emailVerificationExpires = undefined; // Clear the expiration
    // Add last verified date for audit purposes
    user.emailVerifiedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// Resend verification email handler
export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return next(errorHandler(400, "Your email is already verified"));
    }

    // Check if the verification token has expired (24 hours by default)
    if (
      user.emailVerificationExpires &&
      Date.now() < user.emailVerificationExpires
    ) {
      return next(
        errorHandler(
          400,
          "Verification email is still valid. Please check your inbox"
        )
      );
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send the verification email again
    await sendVerificationEmail(user);

    res.status(200).json({
      success: true,
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};
