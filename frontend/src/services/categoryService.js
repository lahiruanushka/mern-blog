import apiClient from "../lib/apiClient";

const categoryService = {
  // Create a new category
  createCategory: async (categoryData) => {
    const response = await apiClient.post("/categories", categoryData);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },

  // Update a category by ID
  updateCategory: async (categoryId, updatedData) => {
    const response = await apiClient.put(
      `/categories/${categoryId}`,
      updatedData
    );
    return response.data;
  },

  // Delete a category by ID
  deleteCategory: async (categoryId) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

export default categoryService;
