import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  signin,
  signup,
  google,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  refreshToken,
  signout,
  getCurrentUser,
} from "../controllers/authController.js";
import { errorHandler } from "../utils/error.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Define the rate limiting rule
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => req.ip, // Use req.ip which respects trust proxy
  handler: (req, res, next) => {
    next(
      errorHandler(
        429,
        "Too many login attempts from this IP, please try again after 15 minutes"
      )
    );
  },
});

// Define rate limiting for signup
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 signup attempts per windowMs
  keyGenerator: (req, res) => req.ip, // Use req.ip which respects trust proxy
  handler: (req, res, next) => {
    next(errorHandler(429, "Too many signup attempts, please try again later"));
  },
});

// Define rate limiting for forgot password requests
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 forgot password requests per windowMs
  keyGenerator: (req, res) => req.ip, // Use req.ip which respects trust proxy
  handler: (req, res, next) => {
    next(
      errorHandler(
        429,
        "Too many password reset requests, please try again later"
      )
    );
  },
});

// Define rate limiting for password reset
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 password reset attempts per windowMs
  keyGenerator: (req, res) => req.ip, // Use req.ip which respects trust proxy
  handler: (req, res, next) => {
    next(
      errorHandler(
        429,
        "Too many password reset attempts, please try again later"
      )
    );
  },
});

// Define rate limiting for resend verification email
const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 resend verification requests per windowMs
  keyGenerator: (req, res) => req.ip, // Use req.ip which respects trust proxy
  handler: (req, res, next) => {
    next(
      errorHandler(
        429,
        "Too many verification email requests, please try again later"
      )
    );
  },
});

router.post("/signup", signupLimiter, signup);
router.post("/signin", loginLimiter, signin);
router.post("/signout", signout);
router.post("/google", google);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/resend-verification-email",
  resendVerificationLimiter,
  resendVerificationEmail
);
router.post("/refresh-token", refreshToken);

router.get("/me", protect, getCurrentUser);

export default router;
