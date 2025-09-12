import axiosInstance from "./axiosInstance";

const commentService = {
  // Create a new comment
  createComment: async (commentData) => {
    const response = await axiosInstance.post("/comments", commentData);
    return response.data;
  },

  // Get comments for a specific post
  getPostComments: async (postId) => {
    const response = await axiosInstance.get(`/comments/posts/${postId}`);
    return response.data;
  },

  // Like a comment
  likeComment: async (commentId) => {
    const response = await axiosInstance.put(`/comments/${commentId}/like`);
    return response.data;
  },

  // Edit a comment
  editComment: async (commentId, updatedContent) => {
    const response = await axiosInstance.put(`/comments/${commentId}`, {
      content: updatedContent,
    });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Get all comments (admin only)
  getComments: async () => {
    const response = await axiosInstance.get(`/comments`);
    return response.data;
  },
};

export default commentService;
