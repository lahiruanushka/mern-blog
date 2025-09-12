import axiosInstance from "./axiosInstance";

const categoryService = {
  // Create a new category
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post("/categories", categoryData);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },

  // Update a category by ID
  updateCategory: async (categoryId, updatedData) => {
    const response = await axiosInstance.put(`/categories/${categoryId}`, updatedData);
    return response.data;
  },

  // Delete a category by ID
  deleteCategory: async (categoryId) => {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

export default categoryService;
