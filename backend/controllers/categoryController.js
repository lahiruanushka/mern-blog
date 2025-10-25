import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description || "",
      color: color,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        name: name.trim().toLowerCase(),
        description: description || "",
        color: color,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.categoryId
    );

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};
