import apiClient from "../lib/apiClient";

const commentService = {
  // Create a new comment
  createComment: async (commentData) => {
    const response = await apiClient.post("/comments", commentData);
    return response.data;
  },

  // Get comments for a specific post
  getPostComments: async (postId) => {
    const response = await apiClient.get(`/comments/posts/${postId}`);
    return response.data;
  },

  // Like a comment
  likeComment: async (commentId) => {
    const response = await apiClient.put(`/comments/${commentId}/like`);
    return response.data;
  },

  // Edit a comment
  editComment: async (commentId, updatedContent) => {
    const response = await apiClient.put(`/comments/${commentId}`, {
      content: updatedContent,
    });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Get all comments (admin only)
  getComments: async () => {
    const response = await apiClient.get(`/comments`);
    return response.data;
  },
};

export default commentService;
