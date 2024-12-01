import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  signin,
  signup,
  google,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { errorHandler } from "../utils/error.js";

const router = express.Router();

// Define the rate limiting rule
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      errorHandler(
        429,
        "Too many login attempts from this IP, please try again after 15 minutes"
      )
    );
  },
});

router.post("/signup", signup);

// Apply the rate limiter to login route
router.post("/signin", loginLimiter, signin);

router.post("/google", google);

// Endpoint for "forgot password"
router.post("/forgot-password", forgotPassword);

// Endpoint for "reset password"
router.post("/reset-password", resetPassword);

export default router;
