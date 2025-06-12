import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/add-user", adminMiddleware, registerUser);

export default router;
