import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getposts,deletepost, updatepost, getpost  } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get('/getpost/:postId', getpost);
router.get("/getposts", getposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)

export default router;
