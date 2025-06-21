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

/**
 * @swagger
 * /add-shortlet:
 *   post:
 *     summary: Add a new shortlet
 *     tags:
 *       - Shortlet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Luxury Apartment"
 *               description:
 *                 type: string
 *                 example: "A beautiful apartment in the city center."
 *               price:
 *                 type: number
 *                 example: 150
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Shortlet added successfully
 *       400:
 *         description: Request body is missing
 *       401:
 *         description: Empty fields are not allowed
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /{shortletId}:
 *   get:
 *     summary: Fetch a shortlet by ID
 *     tags:
 *       - Shortlet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: shortletId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Shortlet fetched successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Fetch all shortlets for the user
 *     tags:
 *       - Shortlet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       401:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /{shortletId}/edit:
 *   put:
 *     summary: Update a shortlet by ID
 *     tags:
 *       - Shortlet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: shortletId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Luxury Apartment"
 *               description:
 *                 type: string
 *                 example: "An updated description of the apartment."
 *               price:
 *                 type: number
 *                 example: 200
 *     responses:
 *       200:
 *         description: Shortlet updated successfully
 *       401:
 *         description: Shortlet ID is required
 *       500:
 *         description: Internal server error
 */

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
