import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
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
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"], // Add more providers as needed
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: { type: Date },

    // New security and tracking fields
    registrationIP: {
      type: String,
      default: null,
    },
    lastLoginIP: {
      type: String,
      default: null,
    },
    accountCreatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginHistory: [
      {
        ip: { type: String },
        timestamp: { type: Date, default: Date.now },
        device: { type: String }, // Optional: store device information
        location: {
          country: { type: String },
          city: { type: String },
        },
      },
    ],
    securitySettings: {
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
      preferredMFA: {
        type: String,
        enum: ["email", "sms", "authenticator", null],
        default: null,
      },
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned", "pending_verification"],
      default: "active",
    },
    suspensionReason: {
      type: String,
      default: null,
    },
    suspensionExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    // Add indexing for performance and uniqueness
    indexes: [
      { fields: { email: 1 }, unique: true },
      { fields: { username: 1 }, unique: true },
      { fields: { googleId: 1 }, sparse: true },
    ],
  }
);

// Optional: Add a pre-save hook for additional validation or processing
userSchema.pre("save", function (next) {
  // Ensure username is lowercase and trimmed
  if (this.isModified("username")) {
    this.username = this.username.toLowerCase().trim();
  }

  // Ensure email is lowercase
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase().trim();
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
