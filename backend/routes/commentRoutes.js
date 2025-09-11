import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getcomments,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/create", protect, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", protect, likeComment);
router.put("/editComment/:commentId", protect, editComment);
router.delete("/deleteComment/:commentId", protect, deleteComment);
router.get("/getcomments", protect, getcomments);

export default router;
