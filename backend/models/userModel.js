import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    }, // Track failed attempts
    lockUntil: {
      type: Date,
      default: null,
    }, // Lock the account until this time
  },
  { timestamps: true }
);

// Create user model
const User = mongoose.model("User", userSchema);

export default User;
