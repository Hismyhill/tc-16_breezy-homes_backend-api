import Shortlet from "../models/shortletModel.js";
import Review from "../models/reviewModel.js";
import {
  sendError,
  sendSuccess,
  sendSuccessWithPayload,
} from "../utils/helpers.js";

export async function addShortlet(req, res) {
  try {
    const { title, price, description, image } = req.body;

    if ((!title, !price, !description, !image)) {
      sendError({ res, code: 401, message: "Missing credentials" });
    } else {
      const shortlet = await Shortlet.create({
        title,
        price,
        image,
        description,
      });

      if (!shortlet) {
        sendError({
          res,
          code: 400,
          message: "Shortlet could not be created",
        });
      }

      sendSuccessWithPayload(
        {
          res,
          message: "Shortlet created successfully",
          key: "shortlet",
        },
        shortlet
      );
    }
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllShortlets(req, res) {
  try {
    const shortlets = await Shortlet.findAll({});
    // attributes: [
    //   "title",
    //   "price"
    // ]
    if (shortlets.length === 0) {
      sendError({
        res,
        code: 404,
        message: "Ops! No shortlet found. Start adding shortlets now!",
      });
    } else {
      sendSuccessWithPayload(
        { res, message: "Products fetched successfully", key: "shortlets" },
        shortlets
      );
    }
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getSingleShortlet(req, res) {
  try {
    const shortletId = req.params.shortletId;

    const shortlet = await shortlet.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Shortlet not found" });
    }

    return sendSuccessWithPayload(
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
}

export async function updateShortlet(req, res) {
  try {
    const shortletId = req.params.shortletId;

    const shortlet = await shortlet.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Shortlet not found" });
    }

    await Shortlet.update(req.body, { where: { id: productId } });
    return sendSuccess({ res, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function deleteShortlet(req, res) {
  try {
    const shortletId = req.params.shortletId;

    let shortlet = await Shortlet.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Shortlet not found" });
    } else {
      await Product.destroy({ where: { id: productId } });
      return sendSuccess({ res, message: "Product deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllListedShortlet(req, res) {
  try {
    const shortlet = await Shortlet.findAll({ where: { listed: true } });

    if (!shortlet) {
      sendError({ res, code: 404, message: "Product not found" });
    }

    sendSuccessWithPayload(
      { res, message: "Products fetched successfully", key: "shortlet" },
      shortlet
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllShortletReviews(req, res) {
  try {
    const shortletId = req.params.shortletId;

    const shortletReviews = await Shortlet.findByPk(shortletId, {
      include: [
        {
          model: Review,
          as: "reviews",
        },
      ],
    });

    if (!shortletReviews || shortletReviews?.length === 0) {
      sendError({
        res,
        code: 404,
        message: "No reviews available for this product",
      });
    }

    sendSuccessWithPayload(
      { res, message: "Reviews fetched successfully", key: "shortletReviews" },
      shortletReviews
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}
