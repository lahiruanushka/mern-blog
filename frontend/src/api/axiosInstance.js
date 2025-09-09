import axios from "axios";

// Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends cookies automatically
});

// Response interceptor to handle 403 (access token expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
          withCredentials: true, // cookies are sent automatically
        });

        // No need to store token manually; backend sets cookie
        // Retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh token failed, redirect to login
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
