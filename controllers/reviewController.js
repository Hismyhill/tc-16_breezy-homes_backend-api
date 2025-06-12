import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import { sendError, sendSuccess } from "../utils/helpers.js";

export async function createReview(req, res) {
  try {
    const shortletId = req.params.shortletId;
    const { rating, comment } = req.body;

    const shortlet = await Product.findByPk(shortletId);

    if (!shortlet) {
      sendError({ res, code: 404, message: "Product not found" });
    }

    const review = await shortlet.createReview({ rating, comment });

    if (!review) {
      sendError({ res, code: 401, message: "Review not created" });
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
      res.status(404).json({
        success: false,
        message: "No product found",
      });
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
      res.status(404).json({
        success: false,
        message: "No reviews available for this product",
        data: [],
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        data: productWithReviews.reviews,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
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

    return sendSuccess(
      { res, message: "Reviews fetched successfully" },
      reviews
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}
