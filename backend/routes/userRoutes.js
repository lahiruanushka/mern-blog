import express from "express";
import rateLimit from "express-rate-limit";
import {
  deleteUser,
  test,
  updateUser,
  signout,
  getUsers,
  getUser,
  requestPasswordUpdateOTP,
  updateUserPassword,
  getUserProfileByUsername,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyToken.js";
import { errorHandler } from "../utils/error.js";

const router = express.Router();

// Define the rate limiting rule for OTP requests
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      errorHandler(
        429,
        "Too many OTP requests from this IP, please try again after 15 minutes"
      )
    );
  },
});

// Define the rate limiting rule for password updates
const passwordUpdateLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password updates per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      errorHandler(
        429,
        "Too many password update attempts from this IP, please try again after 1 hour"
      )
    );
  },
});

router.get("/getuser/:username", getUserProfileByUsername);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getuser/:userId", verifyToken, getUser);
router.get("/getusers", verifyToken, getUsers);

router.post(
  "/request-password-update-otp",
  verifyToken,
  otpRequestLimiter,
  requestPasswordUpdateOTP
);

router.put(
  "/update-password",
  verifyToken,
  passwordUpdateLimiter,
  updateUserPassword
);

export default router;
