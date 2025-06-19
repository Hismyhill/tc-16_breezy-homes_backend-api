import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import {
  sendError,
  sendSuccess,
  sendSuccessWithPayload,
} from "../utils/helpers.js";

export async function createReview(req, res) {
  try {
    const shortletId = req.params.shortletId;
    const { rating, comment } = req.body;

    const shortlet = await Product.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Shortlet not found" });
      return;
    }

    const review = await shortlet.createReview({ rating, comment });

    if (!review) {
      sendError({ res, code: 401, message: "Review not created" });
      return;
    }

    return sendSuccess({
      res,
      code: 201,
      message: "Review created successfully",
    });
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getShortletReviews(req, res) {
  try {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);

    if (!product) {
      sendError({ res, code: 401, message: "Product not found" });
      return;
    }

    const productWithReviews = await Product.findByPk(productId, {
      include: [
        {
          model: Review,
          as: "reviews",
        },
      ],
    });

    if (productWithReviews.reviews.length === 0) {
      sendError({
        res,
        code: 401,
        message: "No reviews available for this product",
      });
      return;
    }

    sendSuccessWithPayload(
      { res, message: "Reviews fetched successfully" },
      productWithReviews.reviews
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.findAll({});

    if (!reviews) {
      sendError({
        res,
        code: 404,
        message: "You have no review yet! Start adding reviews",
      });
    }

    return sendSuccessWithPayload(
      { res, message: "Reviews fetched successfully" },
      reviews
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}
