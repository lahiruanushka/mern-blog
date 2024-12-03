import express from "express";
import { deleteUser, test, updateUser, signout,getUsers, getUser, requestPasswordUpdateOTP, updateUserPassword } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);
router.post('/request-password-update-otp', verifyToken, requestPasswordUpdateOTP);
router.put('/update-password', verifyToken, updateUserPassword);

export default router;
