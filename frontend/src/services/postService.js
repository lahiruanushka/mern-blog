import apiClient from "../lib/apiClient";

const postService = {
  // Create a new post
  createPost: async (postData) => {
    const response = await apiClient.post("/posts", postData);
    return response.data;
  },

  // Get all posts
  getPosts: async (params = {}) => {
    // params can include pagination, filters, etc.
    const response = await apiClient.get("/posts", { params });
    return response.data;
  },

  // Get a single post by ID
  getPostById: async (postId) => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  },

  // Update a post by ID
  updatePost: async (postId, updatedData) => {
    const response = await apiClient.put(`/posts/${postId}`, updatedData);
    return response.data;
  },

  // Delete a post by ID
  deletePost: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  },

  // Like a post
  likePost: async (postId) => {
    const response = await apiClient.post(`/posts/${postId}/likes`);
    return response.data;
  },

  // Unlike a post
  unlikePost: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}/likes`);
    return response.data;
  },

  // Get all likes for a post
  getPostLikes: async (postId) => {
    const response = await apiClient.get(`/posts/${postId}/likes`);
    return response.data;
  },
};

export default postService;
