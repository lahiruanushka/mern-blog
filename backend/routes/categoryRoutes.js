import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCategory);
router.get("/", getCategories);
router.put("/:categoryId", protect, adminOnly, updateCategory);
router.delete("/:categoryId", protect, adminOnly, deleteCategory);

export default router;
