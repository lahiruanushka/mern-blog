import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  create,
  getposts,
  getpost,
  updatepost,
  deletepost,
  likePost,
  unlikePost,
  getPostLikes,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", protect, create);
router.get("/", getposts);
router.get("/:id", getpost);
router.put("/:id", protect, updatepost);
router.delete("/:id", protect, deletepost);

// Likes as a sub-resource
router.post("/:id/likes", protect, likePost); // like a post
router.delete("/:id/likes", protect, unlikePost); // unlike a post
router.get("/:id/likes", getPostLikes); // get all likes

export default router;
