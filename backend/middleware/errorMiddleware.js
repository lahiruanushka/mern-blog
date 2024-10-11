export const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      message: message,
    });
  };
  