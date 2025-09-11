import axiosInstance from "./axiosInstance";

const favoriteService = {
  // Get all favorite posts of the logged-in user
  getFavorites: async () => {
    const response = await axiosInstance.get("/favorites");
    return response.data; // { success: true, favorites: [...] }
  },

  // Add a post to favorites
  addToFavorites: async (postId) => {
    const response = await axiosInstance.post("/favorites", { postId });
    return response.data; // { success: true, message: "Added to favorites" }
  },

  // Remove a post from favorites
  removeFromFavorites: async (postId) => {
    const response = await axiosInstance.delete(`/favorites/${postId}`);
    return response.data; // { success: true, message: "Removed from favorites" }
  },
};

export default favoriteService;
