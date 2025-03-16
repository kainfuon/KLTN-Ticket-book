import express from "express";
import { registerUser, loginUser, getUserInfo } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/info", verifyToken, getUserInfo)

export default userRouter