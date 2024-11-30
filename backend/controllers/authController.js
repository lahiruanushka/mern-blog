import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// In-memory store for tracking signup attempts
const signupAttempts = new Map();

// Clean up old attempts periodically
function cleanupSignupAttempts() {
  const now = Date.now();
  for (const [ip, attempt] of signupAttempts.entries()) {
    if (now - attempt.timestamp > 60 * 60 * 1000) { // 1 hour
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
    req.headers['x-forwarded-for'] || 
    req.headers['x-real-ip'] || 
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
      return next(errorHandler(429, "Too many signup attempts. Please try again later."));
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
      timestamp: ipAttempt.timestamp || now
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
