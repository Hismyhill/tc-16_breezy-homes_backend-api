import express from "express";
import {
  sendVerificationEmail,
  verifyUserEmail,
} from "../controllers/emailVerificationController.js";
import { sendError } from "../utils/helpers.js";

const emailVerificationRouter = express.Router();

emailVerificationRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      sendError({ res, code: 401, message: "Email is required" });
      return;
    }

    const createdOTP = await sendVerificationEmail({ res, email });
    sendSuccessWithPayload(
      { res, message: "Otp created successfully", key: "OTP" },
      createdOTP
    );
  } catch (error) {
    console.log();
    sendError({ res });
  }
});

emailVerificationRouter.post("/verify", async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!(email && otp)) {
      sendError({ res, code: 400, message: "Empty otp details not allowed" });
      return;
    }

    await verifyUserEmail({ res, email, otp });
    sendSuccess({ res, message: "Account verified successfully" });
  } catch (error) {
    console.log();
    sendError({ res });
  }
});

export default emailVerificationRouter;
