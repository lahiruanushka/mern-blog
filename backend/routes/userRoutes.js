import express from "express";
import {
  deleteUser,
  updateUser,
  getUsers,
  getUser,
  getUserByUsername,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/:id", protect, getUser);
router.get("/username/:username", getUserByUsername);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
