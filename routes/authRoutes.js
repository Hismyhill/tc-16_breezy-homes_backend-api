import express from "express";

import uploadMiddleware from "../middlewares/upload-middleware.js";
import {
  loginUser,
  registerUser,
  updateUserPassword,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", uploadMiddleware.single("image"), registerUser);
authRouter.get("/login", loginUser);
authRouter.patch("/update-password", updateUserPassword);

export default authRouter;
