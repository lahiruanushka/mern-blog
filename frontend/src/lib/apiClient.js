// apiClient.js - Enhanced with robust token refresh
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    // Add any request headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh-token endpoint or login requests
    if (
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/signin")
    ) {
      return Promise.reject(error);
    }

    // Handle 401 (Unauthorized) or 403 (Forbidden) errors
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        await apiClient.post("/auth/refresh-token");
        
        // Process any queued requests
        processQueue(null);
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect to login
        processQueue(refreshError);
        
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim();
          document.cookie = 
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
        
        // Only redirect if not already on the signin page
        if (!window.location.pathname.includes("/signin")) {
          window.localStorage.setItem("redirectAfterLogin", window.location.pathname);
          window.location.href = "/signin";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default apiClient;
