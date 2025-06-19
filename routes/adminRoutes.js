import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/add-user", adminMiddleware, async (req, res) => {});

export default adminRouter;
