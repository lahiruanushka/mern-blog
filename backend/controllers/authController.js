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
    from: `"ByteThoughts Welcome" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "✉️ Welcome to ByteThoughts - Verify Your Account",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ByteThoughts - Email Verification</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #334155;
                  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                  padding: 20px 0;
              }
              
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 24px;
                  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                  border: 1px solid #e2e8f0;
              }
              
              .header {
                  background: linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%);
                  padding: 40px 30px;
                  text-align: center;
                  position: relative;
                  overflow: hidden;
              }
              
              .header::before {
                  content: '';
                  position: absolute;
                  top: -50%;
                  left: -50%;
                  width: 200%;
                  height: 200%;
                  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                  animation: shimmer 3s ease-in-out infinite;
              }
              
              @keyframes shimmer {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(180deg); }
              }
              
              .logo {
                  position: relative;
                  z-index: 2;
              }
              
              .logo h1 {
                  color: #ffffff;
                  font-size: 32px;
                  font-weight: 900;
                  margin-bottom: 8px;
                  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
              }
              
              .logo p {
                  color: #e2e8f0;
                  font-size: 14px;
                  font-weight: 500;
                  opacity: 0.9;
              }
              
              .welcome-badge {
                  position: relative;
                  z-index: 2;
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                  background: rgba(255, 255, 255, 0.2);
                  backdrop-filter: blur(10px);
                  padding: 12px 20px;
                  border-radius: 16px;
                  margin-top: 20px;
                  border: 1px solid rgba(255, 255, 255, 0.3);
              }
              
              .welcome-badge svg {
                  width: 20px;
                  height: 20px;
                  fill: #ffffff;
              }
              
              .welcome-badge span {
                  color: #ffffff;
                  font-weight: 600;
                  font-size: 14px;
              }
              
              .content {
                  padding: 50px 40px;
                  background: #ffffff;
              }
              
              .greeting {
                  font-size: 28px;
                  font-weight: 800;
                  color: #1e293b;
                  margin-bottom: 8px;
                  text-align: center;
              }
              
              .sub-greeting {
                  font-size: 18px;
                  font-weight: 600;
                  color: #10b981;
                  margin-bottom: 24px;
                  text-align: center;
              }
              
              .message {
                  font-size: 16px;
                  color: #64748b;
                  margin-bottom: 32px;
                  text-align: center;
                  line-height: 1.7;
              }
              
              .welcome-notice {
                  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
                  border: 1px solid #10b981;
                  border-radius: 16px;
                  padding: 24px;
                  margin: 32px 0;
                  position: relative;
                  overflow: hidden;
              }
              
              .welcome-notice::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
              }
              
              .welcome-notice .notice-title {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-weight: 700;
                  color: #064e3b;
                  margin-bottom: 12px;
                  font-size: 16px;
              }
              
              .welcome-notice .notice-title svg {
                  width: 18px;
                  height: 18px;
                  fill: #10b981;
              }
              
              .welcome-notice p {
                  color: #064e3b;
                  font-size: 14px;
                  margin: 0;
                  line-height: 1.6;
              }
              
              .cta-section {
                  text-align: center;
                  margin: 40px 0;
              }
              
              .verify-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
                  color: #ffffff !important;
                  text-decoration: none;
                  padding: 20px 40px;
                  border-radius: 16px;
                  font-weight: 700;
                  font-size: 16px;
                  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
                  transition: all 0.3s ease;
                  position: relative;
                  overflow: hidden;
                  border: 1px solid rgba(255, 255, 255, 0.2);
              }
              
              .verify-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.5);
              }
              
              .verify-button::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                  transition: left 0.5s;
              }
              
              .verify-button:hover::before {
                  left: 100%;
              }
              
              .button-icon {
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  margin-right: 8px;
                  vertical-align: middle;
                  fill: currentColor;
              }
              
              .features-section {
                  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                  border: 1px solid #0ea5e9;
                  border-radius: 20px;
                  padding: 32px;
                  margin: 40px 0;
                  position: relative;
              }
              
              .features-title {
                  text-align: center;
                  font-size: 20px;
                  font-weight: 700;
                  color: #0c4a6e;
                  margin-bottom: 24px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
              }
              
              .features-title svg {
                  width: 24px;
                  height: 24px;
                  fill: #0ea5e9;
              }
              
              .features-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                  gap: 20px;
                  margin-top: 20px;
              }
              
              .feature-item {
                  display: flex;
                  align-items: flex-start;
                  gap: 12px;
                  padding: 16px;
                  background: rgba(255, 255, 255, 0.7);
                  border-radius: 12px;
                  border: 1px solid rgba(14, 165, 233, 0.2);
              }
              
              .feature-icon {
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                  border-radius: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
              }
              
              .feature-icon svg {
                  width: 20px;
                  height: 20px;
                  fill: #ffffff;
              }
              
              .feature-content h4 {
                  color: #0c4a6e;
                  font-weight: 600;
                  font-size: 14px;
                  margin-bottom: 4px;
              }
              
              .feature-content p {
                  color: #075985;
                  font-size: 13px;
                  line-height: 1.4;
                  margin: 0;
              }
              
              .alternative-method {
                  background: #f8fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 16px;
                  padding: 24px;
                  margin: 32px 0;
              }
              
              .alternative-method h3 {
                  color: #1e293b;
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 12px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
              }
              
              .alternative-method h3 svg {
                  width: 18px;
                  height: 18px;
                  fill: #64748b;
              }
              
              .url-box {
                  background: #ffffff;
                  border: 2px dashed #cbd5e1;
                  border-radius: 12px;
                  padding: 16px;
                  margin-top: 12px;
                  word-break: break-all;
                  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                  font-size: 13px;
                  color: #475569;
                  line-height: 1.5;
              }
              
              .stats-section {
                  display: flex;
                  justify-content: space-between;
                  gap: 20px;
                  margin: 32px 0;
              }
              
              .stat-item {
                  flex: 1;
                  text-align: center;
                  padding: 20px;
                  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                  border-radius: 16px;
                  border: 1px solid #10b981;
              }
              
              .stat-number {
                  font-size: 24px;
                  font-weight: 900;
                  color: #10b981;
                  display: block;
                  margin-bottom: 4px;
              }
              
              .stat-label {
                  font-size: 12px;
                  color: #064e3b;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
              }
              
              .footer {
                  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                  color: #e2e8f0;
                  padding: 40px;
                  text-align: center;
              }
              
              .footer-brand {
                  font-size: 20px;
                  font-weight: 800;
                  color: #ffffff;
                  margin-bottom: 8px;
              }
              
              .footer-tagline {
                  font-size: 14px;
                  color: #94a3b8;
                  margin-bottom: 24px;
              }
              
              .footer-links {
                  display: flex;
                  justify-content: center;
                  gap: 30px;
                  margin-bottom: 24px;
                  flex-wrap: wrap;
              }
              
              .footer-links a {
                  color: #cbd5e1;
                  text-decoration: none;
                  font-size: 14px;
                  font-weight: 500;
                  transition: color 0.3s ease;
              }
              
              .footer-links a:hover {
                  color: #10b981;
              }
              
              .footer-social {
                  display: flex;
                  justify-content: center;
                  gap: 15px;
                  margin-bottom: 20px;
              }
              
              .social-link {
                  display: inline-block;
                  width: 40px;
                  height: 40px;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 50%;
                  text-align: center;
                  line-height: 40px;
                  color: #cbd5e1;
                  text-decoration: none;
                  transition: all 0.3s ease;
              }
              
              .social-link:hover {
                  background: #10b981;
                  color: #ffffff;
                  transform: translateY(-2px);
              }
              
              .footer-disclaimer {
                  font-size: 12px;
                  color: #64748b;
                  line-height: 1.5;
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid #475569;
              }
              
              @media only screen and (max-width: 600px) {
                  .email-container {
                      margin: 0 10px;
                      border-radius: 16px;
                  }
                  
                  .content {
                      padding: 30px 20px;
                  }
                  
                  .header {
                      padding: 30px 20px;
                  }
                  
                  .logo h1 {
                      font-size: 28px;
                  }
                  
                  .features-grid {
                      grid-template-columns: 1fr;
                      gap: 15px;
                  }
                  
                  .stats-section {
                      flex-direction: column;
                      gap: 12px;
                  }
                  
                  .footer-links {
                      flex-direction: column;
                      gap: 15px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <!-- Header Section -->
              <div class="header">
                  <div class="logo">
                      <h1>ByteThoughts</h1>
                      <p>One byte, one thought</p>
                  </div>
                  <div class="welcome-badge">
                      <svg viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                      </svg>
                      <span>Account Verification</span>
                  </div>
              </div>
              
              <!-- Main Content -->
              <div class="content">
                  <h2 class="greeting">Welcome to ByteThoughts!</h2>
                  <p class="sub-greeting">You're almost ready to start your journey</p>
                  <p class="message">
                      Thank you for joining our community of thinkers, writers, and innovators. 
                      To complete your account setup and start sharing your thoughts, please verify your email address.
                  </p>
                  
                  <!-- Welcome Notice -->
                  <div class="welcome-notice">
                      <div class="notice-title">
                          <svg viewBox="0 0 24 24">
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                          </svg>
                          Why verify your email?
                      </div>
                      <p>
                          Email verification helps us keep your account secure and ensures you receive important 
                          updates about your posts, comments, and community interactions. It also enables 
                          password recovery and account notifications.
                      </p>
                  </div>
                  
                  <!-- CTA Section -->
                  <div class="cta-section">
                      <a href="${verificationUrl}" class="verify-button">
                          <svg class="button-icon" viewBox="0 0 24 24">
                              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                          </svg>
                          Verify My Email Address
                      </a>
                  </div>
                  
                  <!-- Features Section -->
                  <div class="features-section">
                      <div class="features-title">
                          <svg viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                          </svg>
                          What's waiting for you
                      </div>
                      <div class="features-grid">
                          <div class="feature-item">
                              <div class="feature-icon">
                                  <svg viewBox="0 0 24 24">
                                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                  </svg>
                              </div>
                              <div class="feature-content">
                                  <h4>Create & Publish</h4>
                                  <p>Share your thoughts with our rich text editor and beautiful post layouts.</p>
                              </div>
                          </div>
                          <div class="feature-item">
                              <div class="feature-icon">
                                  <svg viewBox="0 0 24 24">
                                      <path d="M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                                  </svg>
                              </div>
                              <div class="feature-content">
                                  <h4>Discover Content</h4>
                                  <p>Explore articles from writers across different topics and interests.</p>
                              </div>
                          </div>
                          <div class="feature-item">
                              <div class="feature-icon">
                                  <svg viewBox="0 0 24 24">
                                      <path d="M18,8H6V6H18V8M18,11H6V9H18V11M18,14H6V12H18V14M22,4A2,2 0 0,0 20,2H4A2,2 0 0,0 2,4V16A2,2 0 0,0 4,18H18L22,22V4Z" />
                                  </svg>
                              </div>
                              <div class="feature-content">
                                  <h4>Engage & Comment</h4>
                                  <p>Join discussions and connect with like-minded individuals.</p>
                              </div>
                          </div>
                          <div class="feature-item">
                              <div class="feature-icon">
                                  <svg viewBox="0 0 24 24">
                                      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                                  </svg>
                              </div>
                              <div class="feature-content">
                                  <h4>Save Favorites</h4>
                                  <p>Bookmark articles you love and build your personal reading collection.</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
              </div>
              
              <!-- Footer -->
              <div class="footer">
                  <div class="footer-brand">ByteThoughts</div>
                  <div class="footer-tagline">One byte, one thought</div>
                  
                  <div class="footer-links">
                      <a href="#">Getting Started</a>
                      <a href="#">Community Guidelines</a>
                      <a href="#">Help & Support</a>
                      <a href="#">Contact Us</a>
                  </div>
                  
                  <div class="footer-social">
                      <a href="#" class="social-link">f</a>
                      <a href="#" class="social-link">t</a>
                      <a href="#" class="social-link">in</a>
                      <a href="#" class="social-link">ig</a>
                  </div>
                  
                  <div class="footer-disclaimer">
                      <strong>Welcome to the community!</strong> This verification link will expire in 24 hours. 
                      If you didn't create a ByteThoughts account, you can safely ignore this email.
                      <br><br>
                      This email was sent to ${user.email} because an account was created with this email address.
                      Questions? Reply to this email or contact our support team.
                  </div>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Utility function to generate a unique username
const generateUniqueUsername = async (firstName, lastName) => {
  // Base: combine names and lowercase
  let baseUsername = `${firstName}${lastName}`
    .toLowerCase()
    .replace(/\s+/g, "");
  let username = baseUsername;
  let counter = 1;

  // Keep checking until a unique username is found
  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password, recaptchaToken } = req.body;

  // Get client IP (works with proxies)
  const ip =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress;

  // Validate first name
  if (!firstName || firstName.length < 3 || firstName.length > 30) {
    return next(
      errorHandler(400, "First name must be between 3-30 characters")
    );
  }

  // Validate last name
  if (!lastName || lastName.length < 3 || lastName.length > 30) {
    return next(errorHandler(400, "Last name must be between 3-30 characters"));
  }

  // Validate email
  if (!email || !validateEmail(email)) {
    return next(errorHandler(400, "Invalid email address"));
  }

  // Validate password strength
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return next(errorHandler(400, generatePasswordFeedback(passwordStrength)));
  }

  // reCAPTCHA validation (only in production)
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

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (existingEmail) {
      return next(errorHandler(400, "Email address already exists"));
    }

    // Generate unique username
    const username = await generateUniqueUsername(firstName, lastName);

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      registrationIP: ip,
      lastLoginIP: ip,
      accountCreatedAt: new Date(),
      isVerified: false, // email verification pending
    });

    // Save user
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser);

    res.status(201).json({
      success: true,
      message: "Signup Successful. Please verify your email.",
      requiresEmailVerification: true,
      generatedUsername: username, // Send back the generated username
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

    // Rate limiting
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
            `Too many login attempts. Try again in ${remainingTime} minutes`
          )
        );
      } else {
        loginAttempts.delete(ip);
      }
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      await logAuthEvent("signin", null, false, ip, userAgent, {
        reason: "User not found",
      });
      return next(errorHandler(400, "Invalid email or password"));
    }

    // Check email verification
    if (!user.isVerified) {
      return next(
        errorHandler(
          400,
          "Your email is not verified. Please verify your email"
        )
      );
    }

    // Check account lock
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
      // Increment failed attempts safely
      const failedAttempts = (user.failedAttempts || 0) + 1;
      const updateFields = { failedAttempts };

      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        updateFields.lockUntil = Date.now() + LOCKOUT_DURATION;
      }

      await User.updateOne({ _id: user._id }, { $set: updateFields });

      userAttempts.count += 1;
      userAttempts.timestamp = Date.now();
      loginAttempts.set(ip, userAttempts);

      await logAuthEvent("signin", user._id, false, ip, userAgent, {
        reason: "Invalid password",
      });
      return next(errorHandler(400, "Invalid email or password"));
    }

    // Successful login: reset counters safely
    await User.updateOne(
      { _id: user._id },
      { $set: { failedAttempts: 0, lockUntil: null } }
    );
    loginAttempts.delete(ip);

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret",
      { expiresIn: "7d" }
    );

    // Cookies options
    const accessTokenCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    };

    const refreshTokenCookieOptions = {
      ...accessTokenCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token",
    };

    // Remove sensitive data
    const { password: pass, ...userData } = user._doc;

    await logAuthEvent("signin", user._id, true, ip, userAgent);

    // Send response
    res
      .status(200)
      .cookie("access_token", accessToken, accessTokenCookieOptions)
      .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
      .json({
        success: true,
        message: "Login successful",
        data: {
          user: userData,
          loginTimestamp: new Date(),
          expiresIn: 15 * 60,
        },
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

        // Generate access token with short expiry
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "15m" } // 15 minutes
        );

        // Generate refresh token with longer expiry
        const refreshToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret",
          { expiresIn: "7d" } // 7 days
        );

        // Set secure cookie options for access token
        const accessTokenCookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 minutes
          path: "/",
        };

        // Set secure cookie options for refresh token
        const refreshTokenCookieOptions = {
          ...accessTokenCookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: "/api/auth/refresh-token",
        };

        const { password, ...userData } = user._doc;

        return res
          .status(200)
          .cookie("access_token", accessToken, accessTokenCookieOptions)
          .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
          .json({
            success: true,
            message: "Successfully authenticated with Google",
            data: {
              ...userData,
              loginTimestamp: new Date(),
              expiresIn: 15 * 60, // 15 minutes in seconds
            },
          });
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

      // Generate access token with short expiry
      const accessToken = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // 15 minutes
      );

      // Generate refresh token with longer expiry
      const refreshToken = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret",
        { expiresIn: "7d" } // 7 days
      );

      // Set secure cookie options for access token
      const accessTokenCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      };

      // Set secure cookie options for refresh token
      const refreshTokenCookieOptions = {
        ...accessTokenCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/api/auth/refresh-token",
      };

      const { password, ...userData } = newUser._doc;

      return res
        .status(200)
        .cookie("access_token", accessToken, accessTokenCookieOptions)
        .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
        .json({
          ...userData,
          accessToken,
          refreshToken,
          loginTimestamp: new Date(),
          expiresIn: 15 * 60, // 15 minutes in seconds
        });
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email, recaptchaToken } = req.body;
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
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
            remoteip: ip,
          },
        }
      );

      const { success, score, action, hostname } = captchaResponse.data;

      if (!success || score <= 0.7) {
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

    const user = await User.findOne({ email });

    // If user doesn't exist, send generic response
    if (!user) {
      return res.json({
        success: true,
        message:
          "If we found an account with this email, a password reset link has been sent. Please check your inbox.",
      });
    }

    // Check if user uses social authentication
    if (user.authProvider !== "local") {
      // Log the attempt for security monitoring
      console.warn("Password reset attempted for social auth account:", {
        email,
        authProvider: user.authProvider,
        ip,
      });

      // Send a specific message for social auth users
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.authProvider} authentication. Please sign in with ${user.authProvider}.`,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Update only the token fields
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: resetTokenHash,
          passwordResetExpires: Date.now() + 15 * 60 * 1000,
        },
      }
    );

    resetAttempts.set(ip, {
      count: attempts.count + 1,
      timestamp: attempts.timestamp,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
    });

    const mailOptions = {
      from: `"ByteThoughts Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🔐 Secure Password Reset - ByteThoughts",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - ByteThoughts</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #334155;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    padding: 20px 0;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 24px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }
                
                .header {
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #6366f1 100%);
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    animation: shimmer 3s ease-in-out infinite;
                }
                
                @keyframes shimmer {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(180deg); }
                }
                
                .logo {
                    position: relative;
                    z-index: 2;
                }
                
                .logo h1 {
                    color: #ffffff;
                    font-size: 32px;
                    font-weight: 900;
                    margin-bottom: 8px;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                }
                
                .logo p {
                    color: #e2e8f0;
                    font-size: 14px;
                    font-weight: 500;
                    opacity: 0.9;
                }
                
                .security-badge {
                    position: relative;
                    z-index: 2;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 12px 20px;
                    border-radius: 16px;
                    margin-top: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                
                .security-badge svg {
                    width: 20px;
                    height: 20px;
                    fill: #ffffff;
                }
                
                .security-badge span {
                    color: #ffffff;
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .content {
                    padding: 50px 40px;
                    background: #ffffff;
                }
                
                .greeting {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 16px;
                    text-align: center;
                }
                
                .message {
                    font-size: 16px;
                    color: #64748b;
                    margin-bottom: 32px;
                    text-align: center;
                    line-height: 1.7;
                }
                
                .security-notice {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    border: 1px solid #f59e0b;
                    border-radius: 16px;
                    padding: 20px;
                    margin: 32px 0;
                    position: relative;
                    overflow: hidden;
                }
                
                .security-notice::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
                }
                
                .security-notice .notice-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    color: #92400e;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                
                .security-notice .notice-title svg {
                    width: 16px;
                    height: 16px;
                    fill: #f59e0b;
                }
                
                .security-notice p {
                    color: #92400e;
                    font-size: 14px;
                    margin: 0;
                }
                
                .cta-section {
                    text-align: center;
                    margin: 40px 0;
                }
                
                .reset-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 20px 40px;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 16px;
                    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .reset-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
                }
                
                .reset-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }
                
                .reset-button:hover::before {
                    left: 100%;
                }
                
                .button-icon {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;
                    vertical-align: middle;
                    fill: currentColor;
                }
                
                .alternative-method {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 24px;
                    margin: 32px 0;
                }
                
                .alternative-method h3 {
                    color: #1e293b;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .alternative-method h3 svg {
                    width: 18px;
                    height: 18px;
                    fill: #64748b;
                }
                
                .url-box {
                    background: #ffffff;
                    border: 2px dashed #cbd5e1;
                    border-radius: 12px;
                    padding: 16px;
                    margin-top: 12px;
                    word-break: break-all;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 13px;
                    color: #475569;
                    line-height: 1.5;
                }
                
                .stats-section {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    margin: 32px 0;
                }
                
                .stat-item {
                    flex: 1;
                    text-align: center;
                    padding: 20px;
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                    border-radius: 16px;
                    border: 1px solid #cbd5e1;
                }
                
                .stat-number {
                    font-size: 24px;
                    font-weight: 900;
                    color: #3b82f6;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .footer {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    color: #e2e8f0;
                    padding: 40px;
                    text-align: center;
                }
                
                .footer-brand {
                    font-size: 20px;
                    font-weight: 800;
                    color: #ffffff;
                    margin-bottom: 8px;
                }
                
                .footer-tagline {
                    font-size: 14px;
                    color: #94a3b8;
                    margin-bottom: 24px;
                }
                
                .footer-links {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }
                
                .footer-links a {
                    color: #cbd5e1;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: color 0.3s ease;
                }
                
                .footer-links a:hover {
                    color: #3b82f6;
                }
                
                .footer-social {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .social-link {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    text-align: center;
                    line-height: 40px;
                    color: #cbd5e1;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                
                .social-link:hover {
                    background: #3b82f6;
                    color: #ffffff;
                    transform: translateY(-2px);
                }
                
                .footer-disclaimer {
                    font-size: 12px;
                    color: #64748b;
                    line-height: 1.5;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #475569;
                }
                
                @media only screen and (max-width: 600px) {
                    .email-container {
                        margin: 0 10px;
                        border-radius: 16px;
                    }
                    
                    .content {
                        padding: 30px 20px;
                    }
                    
                    .header {
                        padding: 30px 20px;
                    }
                    
                    .logo h1 {
                        font-size: 28px;
                    }
                    
                    .stats-section {
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    .footer-links {
                        flex-direction: column;
                        gap: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header Section -->
                <div class="header">
                    <div class="logo">
                        <h1>ByteThoughts</h1>
                        <p>One byte, one thought</p>
                    </div>
                    <div class="security-badge">
                        <svg viewBox="0 0 24 24">
                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
                        </svg>
                        <span>Secure Reset Request</span>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="content">
                    <h2 class="greeting">Password Reset Request</h2>
                    <p class="message">
                        We received a request to reset the password for your ByteThoughts account. 
                        If you made this request, click the secure button below to create a new password.
                    </p>
                    
                    <!-- Security Notice -->
                    <div class="security-notice">
                        <div class="notice-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,7H13V9H11V7M11,11H13V17H11V11Z" />
                            </svg>
                            Security Information
                        </div>
                        <p>This reset link will expire in exactly 15 minutes for your security. If you didn't request this reset, you can safely ignore this email - your account remains secure.</p>
                    </div>
                    
                    <!-- CTA Section -->
                    <div class="cta-section">
                        <a href="${resetUrl}" class="reset-button">
                            <svg class="button-icon" viewBox="0 0 24 24">
                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10.5,17L6.5,13L7.91,11.59L10.5,14.17L16.09,8.59L17.5,10L10.5,17Z" />
                            </svg>
                            Reset My Password Securely
                        </a>
                    </div>
                  
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <div class="footer-brand">ByteThoughts</div>
                    <div class="footer-tagline">One byte, one thought</div>
                    
                    <div class="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Security Center</a>
                        <a href="#">Help & Support</a>
                        <a href="#">Contact Us</a>
                    </div>
                    
                    <div class="footer-social">
                        <a href="#" class="social-link">f</a>
                        <a href="#" class="social-link">t</a>
                        <a href="#" class="social-link">in</a>
                        <a href="#" class="social-link">ig</a>
                    </div>
                    
                    <div class="footer-disclaimer">
                        <strong>Security Reminder:</strong> ByteThoughts will never ask for your password via email. 
                        This automated message was sent from a secure server. If you have any concerns about 
                        this email's authenticity, please contact our security team immediately.
                        <br><br>
                        This email was sent to ${user.email} because a password reset was requested for your ByteThoughts account.
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message:
        "If we found an account with this email, a password reset link has been sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return next(
      errorHandler(500, "Could not send reset email. Please try again later.")
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword, recaptchaToken } = req.body;

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress;

  try {
    // --- reCAPTCHA validation in production ---
    if (process.env.NODE_ENV === "production") {
      if (!recaptchaToken) {
        return next(errorHandler(400, "reCAPTCHA token is required"));
      }

      const captchaResponse = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
            remoteip: ip,
          },
        }
      );

      const { success, score } = captchaResponse.data;

      if (!success || score <= 0.7) {
        return next(
          errorHandler(400, "Security check failed. Please try again.")
        );
      }
    }

    // --- Validate request data ---
    if (!token || !newPassword) {
      return next(errorHandler(400, "Token and new password are required"));
    }

    if (newPassword.length < 8) {
      return next(
        errorHandler(400, "Password must be at least 8 characters long")
      );
    }

    // --- Hash token and find user ---
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(errorHandler(400, "Invalid or expired reset token"));
    }

    // --- Hash new password ---
    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    // --- Safely update only necessary fields ---
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          passwordResetToken: undefined,
          passwordResetExpires: undefined,
          failedAttempts: 0,
          lockUntil: undefined,
        },
      }
    );

    res.status(200).json({
      success: true,
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

// Refresh access token
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token; // match the cookie name
    if (!refreshToken)
      return next(errorHandler(401, "No refresh token provided"));

    const decoded = jwt.decode(refreshToken);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, "Invalid refresh token"));

      const accessToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
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
      return next(errorHandler(404, "Invalid email"));
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

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove sensitive fields
    const { password, ...safeUser } = user._doc || user;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
