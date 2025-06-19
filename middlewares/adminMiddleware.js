import jwt from "jsonwebtoken";
import { sendError } from "../utils/helpers.js";

// admin authentication middleware
async function authAdmin(req, res, next) {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return sendError({
        res,
        code: 400,
        message: "Access denied! Try to login again.",
      });
    }

    const decodedToken = jwt.verify(atoken, process.env.JWT_SECRET);

    if (decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return sendError({
        res,
        code: 403,
        message: "Not authorized to access this page.",
      });
    } else {
      next();
    }
  } catch (error) {
    sendError({
      res,
      code: 500,
    });
  }
}

export default authAdmin;
