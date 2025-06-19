import express from "express";

import User from "../models/userModel.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";
import { sendSuccessWithPayload, sendError } from "../utils/helpers.js";
import {
  addShortlet,
  getShortlet,
  getAllUserShortlets,
  updateShortlet,
} from "../controllers/shortletController.js";
import uploadMiddleware from "../middlewares/upload-middleware.js";

const shortletRouter = express.Router();

shortletRouter.post(
  "/add-shortlet",
  verifyToken,
  uploadMiddleware.array("images", 3),
  async (req, res) => {
    try {
      const userId = req.user.userId;

      if (!req.body) {
        sendError({ res, code: 400, message: "Request body is missing." });
        return;
      }

      const { title, description, price } = req.body;
      const images = req.files;

      if (!(title && description && price && images && images.length === 3)) {
        sendError({ res, code: 401, message: "Empty fields are not allowed." });
        return;
      }

      const shortlet = await addShortlet({
        res,
        userId,
        title,
        description,
        price,
        images,
      });
      return sendSuccessWithPayload(
        { res, message: "Shortlet added successfully", key: "shortlet" },
        shortlet
      );
    } catch (error) {
      console.log(error);
      sendError({ res });
    }
  }
);

shortletRouter.get("/:shortletId", authorizeRoles("host"), async (req, res) => {
  try {
    const shortletId = req.params.shortletId;

    const shortlet = await getShortlet({ res, shortletId });

    sendSuccessWithPayload(
      {
        res,
        message: "Shortlet fetched successfully",
        key: "shortlet",
      },
      shortlet
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
});

shortletRouter.get("/", authorizeRoles("host"), async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      sendError({ res, code: 401, message: "Product not found" });
      return;
    }

    const shortlets = await getAllUserShortlets({ res, userId });

    sendSuccessWithPayload(
      { res, message: "Reviews fetched successfully", key: "shortlets" },
      shortlets
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
});

shortletRouter.put("/:shortletId/edit", async (req, res) => {
  try {
    const shortletId = req.params.shortletId;

    if (!shortletId) {
      sendError({
        res,
        code: 401,
        message: "Shortlet Id is required",
      });
      return;
    }

    await updateShortlet({ res, shortletId });

    sendSuccess({ res, message: "Shortlet updated successfully" });
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
});

export default shortletRouter;
