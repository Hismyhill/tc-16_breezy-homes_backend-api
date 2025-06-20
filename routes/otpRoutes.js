import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";
import { sendSuccessWithPayload, sendError } from "../utils/helpers.js";

const OTPRouter = express.Router();

/**
 * @swagger
 * /otp/:
 *   post:
 *     summary: Send an OTP to the user
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               subject:
 *                 type: string
 *                 example: "Your OTP Code"
 *               message:
 *                 type: string
 *                 example: "Your OTP is 123456"
 *               duration:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: OTP sent successfully. Check your inbox.
 *       400:
 *         description: Provide values for email, subject, and message.
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /otp/verify:
 *   post:
 *     summary: Verify an OTP
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Account successfully verified.
 *       400:
 *         description: Provide values for email and OTP.
 *       500:
 *         description: Internal server error
 */

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
