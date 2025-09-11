import axiosInstance from "./axiosInstance";

const authService = {
  // Signup new user
  signup: async (userData) => {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response.data;
  },

  // Signin user
  signin: async (credentials) => {
    const response = await axiosInstance.post("/auth/signin", credentials);
    return response.data;
  },

  // Signout user
  signout: async () => {
    const response = await axiosInstance.post("/auth/signout");
    return response.data;
  },

  // Google authentication
  googleAuth: async (googleData) => {
    const response = await axiosInstance.post("/auth/google", googleData);
    return response.data;
  },

  // Forgot password request
  forgotPassword: async (data) => {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token) => {
    const response = await axiosInstance.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerificationEmail: async (data) => {
    const response = await axiosInstance.post(
      "/auth/resend-verification-email",
      data
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },
};

export default authService;
