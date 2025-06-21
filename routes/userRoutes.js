import express from "express";

import { authorizeRoles } from "../middlewares/authMiddleware.js";
import { sendError, sendSuccessWithPayload } from "../utils/helpers.js";

const userRouter = express.Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Fetch user settings
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 fontSize:
 *                   type: string
 *                 contrastMode:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

userRouter.get("/settings", authorizeRoles("guest"), async (req, res) => {
  try {
    const user = req.user;

    sendSuccessWithPayload(
      { res, message: "Settings fetched successfully", key: "settings" },
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        fontSize: user.fontSize,
        contrastMode: user.contrastMode,
      }
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
});

/**
 * @swagger
 * /settings/edit:
 *   put:
 *     summary: Update user settings
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               fontSize:
 *                 type: string
 *               contrastMode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       500:
 *         description: Internal server error
 */

userRouter.put(
  "/settings/edit",
  authorizeRoles("guest"),
  async ({ req, res }) => {
    try {
      await updateUserSettings({ req, res });

      sendSuccess({ res, message: "Settings updated successfully" });
    } catch (error) {
      console.log(error);
      sendError({ res });
    }
  }
);

export default userRouter;
