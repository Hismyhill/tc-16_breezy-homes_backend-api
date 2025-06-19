import Shortlet from "../models/shortletModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import { sendError } from "../utils/helpers.js";
import { uploadImages } from "../utils/imageUploader.js";

export async function addShortlet({
  res,
  userId,
  title,
  description,
  price,
  images,
}) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      sendError({ res, code: 404, message: "User not found" });
      return;
    }

    // Upload images
    const uploadedImages = await uploadImages(images);

    if (!uploadedImages || uploadedImages.length !== 3)
      sendError({
        res,
        code: 400,
        message: "Failed to upload images. Please try again.",
      });

    // Create shortlet object
    let newShortlet = {
      userId,
      title,
      description,
      price,
      images: uploadedImages,
    };

    newShortlet = await Shortlet.create(newShortlet);

    return newShortlet;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllUserShortlets({ res, userId }) {
  try {
    const userWithShortlets = await User.findByPk(userId, {
      include: [
        {
          model: Shortlet,
          as: "shortlets",
        },
      ],
    });

    if (userWithShortlets.shortlets.length === 0) {
      sendError({
        res,
        code: 404,
        message: "No shortlet available for this user",
      });
      return;
    }

    return userWithShortlets.shortlets;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getShortlet({ res, shortletId }) {
  try {
    const shortlet = await shortlet.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Shortlet not found" });
      return;
    }

    return shortlet;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function updateShortlet({ res, shortletId }) {
  try {
    const shortlet = await shortlet.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Shortlet not found" });
      return;
    }

    return await Shortlet.update(req.body, { where: { id: productId } });
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function deleteShortlet({ res, shortletId }) {
  try {
    let shortlet = await Shortlet.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Shortlet not found" });
      return;
    }

    await Product.destroy({ where: { id: productId } });
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllListedShortlet({ res }) {
  try {
    const shortlet = await Shortlet.findAll({ where: { listed: true } });

    if (!shortlet) {
      sendError({ res, code: 404, message: "Product not found" });
      return;
    }

    return shortlet;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllShortletReviews({ shortletId, res }) {
  try {
    const shortletReviews = await Shortlet.findByPk(shortletId, {
      include: [
        {
          model: Review,
          as: "reviews",
        },
      ],
    });

    if (!shortletReviews.reviews || shortletReviews.reviews.length === 0) {
      sendError({
        res,
        code: 404,
        message: "No reviews available for this product",
      });
      return;
    }

    return shortletReviews.reviews;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllShortlets({ res }) {
  try {
    const shortlets = await Shortlet.findAll({});

    if (!shortlets || shortlets?.length === 0) {
      sendError({
        res,
        code: 404,
        message: "No shortlet available",
      });
      return;
    }

    return shortletReviews.reviews;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}
