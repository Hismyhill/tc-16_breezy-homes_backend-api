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

/**
 * @swagger
 * /forgot_password/:
 *   post:
 *     summary: Request an OTP for password reset
 *     tags:
 *       - Forgot Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully. Check your inbox.
 *       400:
 *         description: Email is required
 *       500:
 *         description: Internal server error
 */

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
    const createdForgotPasswordOTP = await forgotPasswordOTP({ res, email });

    return sendSuccessWithPayload(
      { res, message: "OTP sent successfully. Check your inbox." },
      createdForgotPasswordOTP
    );
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
});

/**
 * @swagger
 * /forgot_password/reset:
 *   post:
 *     summary: Reset user password using OTP
 *     tags:
 *       - Forgot Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password was reset successfully.
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal server error
 */

forgotPasswordRouter.post("/reset", async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!(email && newPassword && otp))
      sendError({ res, code: 400, message: "All fields are required" });

    await resetUserPassword({ res, email, newPassword, otp });
    sendSuccess({ res, message: "Password was reset successfully." });
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
});

export default forgotPasswordRouter;
