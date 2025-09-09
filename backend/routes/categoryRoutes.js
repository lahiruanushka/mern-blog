import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", verifyToken, createCategory);
router.get("/all", getCategories);
router.put("/update/:categoryId", verifyToken, updateCategory);
router.delete("/delete/:categoryId", verifyToken, deleteCategory);

export default router;
