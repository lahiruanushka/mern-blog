import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  create,
  getposts,
  getpost,
  updatepost,
  deletepost,
  likePost,
  unlikePost,
  getPostLikes
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", verifyToken, create);            
router.get("/", getposts);                        
router.get("/:id", getpost);                       
router.put("/:id", verifyToken, updatepost);       
router.delete("/:id", verifyToken, deletepost);    

// Likes as a sub-resource
router.post("/:id/likes", verifyToken, likePost);         // like a post
router.delete("/:id/likes", verifyToken, unlikePost);     // unlike a post
router.get("/:id/likes", getPostLikes);                   // get all likes

export default router;
