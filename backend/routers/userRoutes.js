import express from "express";
import { registerUser, loginUser, getUserInfo, getAllUsers, changePassword } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/change-password", verifyToken, changePassword)
userRouter.get("/profile", verifyToken, getUserInfo)
userRouter.get("/all", verifyToken, getAllUsers) // Đường dẫn để lấy tất cả người dùng
export default userRouter