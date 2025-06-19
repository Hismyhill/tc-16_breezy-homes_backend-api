import express from "express";

import { authorizeRoles } from "../middlewares/authMiddleware.js";
import { sendError, sendSuccessWithPayload } from "../utils/helpers.js";
import User from "../models/userModel.js";

const userRouter = express.Router();

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
