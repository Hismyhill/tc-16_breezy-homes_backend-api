import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";
import { sendSuccessWithPayload, sendError } from "../utils/helpers.js";

const OTPRouter = express.Router();

OTPRouter.post("/", async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;

    if (!(email && subject && message)) {
      sendError({
        res,
        code: 400,
        message: "Provide values for email, subject and message",
      });
      return;
    }
    const createdOTP = await sendOTP({ email, subject, message, duration });

    return sendSuccessWithPayload(
      { res, message: "OTP sent successfully. Check your inbox." },
      createdOTP
    );
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
});

OTPRouter.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!(email && otp)) {
      sendError({
        res,
        code: 400,
        message: "Provide values for email, subject and message",
      });
    }
    const validOTP = await verifyOTP({ email, otp });
    sendSuccessWithPayload(
      { res, message: "Account successfully verified", key: "valid" },
      validOTP
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
});

export default OTPRouter;
