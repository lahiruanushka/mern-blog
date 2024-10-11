
export const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error; // Throw the error to be caught by the error middleware
};
