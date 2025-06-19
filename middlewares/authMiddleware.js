import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { sendError } from "../utils/helpers.js";

export function verifyToken(req, res, next) {
  try {
    const { token } = req.headers;
    // req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      sendError({
        res,
        message: "Access denied! No token provided",
        code: 401,
      });

      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.roles)) {
      sendError({ code: 403, message: "Access denied!" });
      return;
    }

    next();
  };
}
