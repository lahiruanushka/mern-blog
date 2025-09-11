import axiosInstance from "./axiosInstance";

const userService = {
  // Get all users (admin only)
  getUsers: async (startIndex = 0) => {
    const response = await axiosInstance.get("/users", {
      params: { startIndex }
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  // Get user by username (public profile)
  getUserByUsername: async (username) => {
    const response = await axiosInstance.get(`/users/username/${username}`);
    return response.data;
  },

  // Update user profile
  updateUser: async (id, updatedData) => {
    const response = await axiosInstance.put(`/users/${id}`, updatedData);
    return response.data;
  },

  // Delete user account
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  // Get posts created by a specific user
  getUserPosts: async (id) => {
    const response = await axiosInstance.get(`/users/${id}/posts`);
    return response.data;
  },
};

export default userService;
