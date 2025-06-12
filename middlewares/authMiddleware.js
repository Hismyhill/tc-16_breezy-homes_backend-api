import { sendError } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return sendError({
        res,
        message: "Access denied! No token provided",
        code: 401,
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decodedToken;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }

  return next();
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return sendError({ code: 403, message: "Access denied!" });
    }

    next();
  };
}
