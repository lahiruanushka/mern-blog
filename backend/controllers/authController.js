import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username) {
    next(errorHandler(400, "Username is required"));
  }

  if (!email) {
    next(errorHandler(400, "Email is required"));
  }

  if (!password) {
    next(errorHandler(400, "Password is required"));
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

    res.json({ sucess: true, message: "Signup Successfull" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    next(errorHandler(400, "Email is required"));
  }

  if (!password) {
    next(errorHandler(400, "Password is required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Invalid email or password"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid email or password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
