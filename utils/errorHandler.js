import { sendError, sendErrorWithPayload } from "./helpers.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0].path;
    return sendError({ res, code: 400, message: `${field} already exists` });
  }

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendErrorWithPayload({
      res,
      message: "Validation error",
      key: "errors",
      errors,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError({ res, code: 401, message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return sendError({ res, code: 401, message: "Token expired" });
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return sendError({ res, code: 400, message: "File size too large" });
  }

  // Default error if no other error code was found.
  sendError({ res, message: err.message || "Internal server error" });
};

export default errorHandler;
