import apiClient from "../lib/apiClient";

const authService = {
  // Signup new user
  signup: async (userData) => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  },

  // Signin user
  signin: async (credentials) => {
    const response = await apiClient.post("/auth/signin", credentials);
    return response.data;
  },

  // Signout user
  signout: async () => {
    try {
      const response = await apiClient.post("/auth/signout");

      // Force page reload to reset interceptor state
      setTimeout(() => window.location.reload(), 100);

      return response.data;
    } catch (error) {
      // Force logout even if server fails
      setTimeout(() => (window.location.href = "/signin"), 100);
      throw error;
    }
  },

  // Google authentication
  googleAuth: async (googleData) => {
    const response = await apiClient.post("/auth/google", googleData);
    return response.data;
  },

  // Forgot password request
  forgotPassword: async (data) => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token) => {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerificationEmail: async (data) => {
    const response = await apiClient.post(
      "/auth/resend-verification-email",
      data
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};

export default authService;
