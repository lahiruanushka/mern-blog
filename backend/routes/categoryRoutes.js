import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", protect, createCategory);
router.get("/all", getCategories);
router.put("/update/:categoryId", protect, updateCategory);
router.delete("/delete/:categoryId", protect, deleteCategory);

export default router;
