import express from "express";
import authRouter from "./routes/authRoutes.js";
import OTPRouter from "./routes/otpRoutes.js";

const routes = express.Router();
routes.use("/user", authRouter);
routes.use("/", OTPRouter);

export default routes;
