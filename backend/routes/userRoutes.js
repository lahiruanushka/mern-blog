import express from "express";
import {
  deleteUser,
  updateUser,
  getUsers,
  getUser,
  getUserProfileByUsername,
  getPostsByUserId,
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUser);
router.get("/username/:username", getUserProfileByUsername);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

// GET posts by user ID (sub-resource)
router.get("/:id/posts", getPostsByUserId);

export default router;
