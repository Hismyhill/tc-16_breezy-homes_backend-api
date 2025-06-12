import express from "express";

import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import uploadMiddleware from "../middlewares/upload-middleware.js";
import {
  deleteImageController,
  getAllImagesController,
  imageUploadController,
} from "../controllers/image-controller.js";

const router = express.Router();

// upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  imageUploadController
);

// to get all images
router.get("/get", authMiddleware, getAllImagesController);

// to delete image
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

export default router;
