import express from "express";

import { body } from "express-validator";
import { loginUser, registerUser } from "../controllers/authController.js";
import { sendError, sendSuccessWithPayload } from "../utils/helpers.js";

const authRouter = express.Router();

// Validation middleware
const registerValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const passwordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const changePasswordValidation = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Please enter your current password"),
];

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [guest, host, helper]
 *                 example: ["guest"]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

authRouter.post("/register", registerValidation, async (req, res) => {
  try {
    const { firstName, lastName, email, password, roles } = req.body;

    const newUser = await registerUser({
      res,
      firstName,
      lastName,
      email,
      password,
      roles,
    });
    return sendSuccessWithPayload(
      { res, message: "User registered successfully", key: "newUser" },
      newUser
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Field is required
 */

authRouter.get("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (!email) {
      sendError({ res, code: 401, message: "Email is required" });
      return;
    }

    if (!password) {
      sendError({ res, code: 401, message: "Password is required" });
      return;
    }
    const token = await loginUser({ res, email, password });

    return sendSuccessWithPayload(
      { res, message: "User logged in successfully", key: "token" },
      token
    );
  } catch (error) {
    console.error(error);
    sendError({ res });
  }
});

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Change the password of a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

export default authRouter;
