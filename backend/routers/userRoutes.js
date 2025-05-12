import express from "express";
import { registerUser, loginUser, getUserInfo, getAllUsers, changePassword, blockUser } from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/change-password", verifyToken, changePassword)
userRouter.get("/profile", verifyToken, getUserInfo)
userRouter.get("/all", verifyAdmin, getAllUsers) 
userRouter.patch("/block", verifyAdmin, blockUser) // Block or unblock user
export default userRouter