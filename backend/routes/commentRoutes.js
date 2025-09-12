import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/posts/:postId", getPostComments);
router.put("/:commentId/like", protect, likeComment);
router.put("/:commentId", protect, editComment);
router.delete("/:commentId", protect, deleteComment);
router.get("/", protect, getComments);

export default router;
