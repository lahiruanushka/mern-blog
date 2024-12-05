import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return next(errorHandler(401, "Please log in to continue"));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, "Your session has expired. Please log in again"));
      }
      if (err.name === 'JsonWebTokenError') {
        return next(errorHandler(401, "Invalid login. Please log in again"));
      }
      return next(errorHandler(401, "Authentication failed. Please try logging in again"));
    }
    
    req.user = user;
    next();
  });
};