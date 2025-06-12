import express from "express";
import { sendOtp } from "../controllers/otpController.js";

const OTPRouter = express.Router();

OTPRouter.post("/otp", sendOtp);

export default OTPRouter;
