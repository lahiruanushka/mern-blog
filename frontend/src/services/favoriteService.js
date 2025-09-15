import apiClient from "../lib/apiClient";

const favoriteService = {
  // Get all favorite posts of the logged-in user
  getFavorites: async () => {
    const response = await apiClient.get("/favorites");
    return response.data; // { success: true, favorites: [...] }
  },

  // Add a post to favorites
  addToFavorites: async (postId) => {
    const response = await apiClient.post("/favorites", { postId });
    return response.data; // { success: true, message: "Added to favorites" }
  },

  // Remove a post from favorites
  removeFromFavorites: async (postId) => {
    const response = await apiClient.delete(`/favorites/${postId}`);
    return response.data; // { success: true, message: "Removed from favorites" }
  },
};

export default favoriteService;
