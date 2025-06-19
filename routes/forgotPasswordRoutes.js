import express from "express";
import {
  sendSuccessWithPayload,
  sendError,
  sendSuccess,
} from "../utils/helpers.js";
import {
  forgotPasswordOTP,
  resetUserPassword,
} from "../controllers/forgotPasswordController.js";

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      sendError({
        res,
        code: 400,
        message: "Email is required",
      });
    }
    const createdForgotPasswordOTP = await forgotPasswordOTP(email);

    return sendSuccessWithPayload(
      { res, message: "OTP sent successfully. Check your inbox." },
      createdForgotPasswordOTP
    );
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
});

export default forgotPasswordRouter;

forgotPasswordRouter.post("/reset", async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!(email && newPassword && otp))
      throw new Error("All fields are required");

    await resetUserPassword({ email, newPassword, otp });
    sendSuccess({ res, message: "Password was reset successfully." });
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
});
