import express from "express";

import uploadMiddleware from "../middlewares/upload-middleware.js";
import { loginUser, registerUser } from "../controllers/authController.js";
import { sendError, sendSuccessWithPayload } from "../utils/helpers.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  uploadMiddleware.single("image"),
  async (req, res) => {
    try {
      let { firstName, lastName, email, password, roles } = req.body;

      firstName = firstName.trim();
      lastName = lastName.trim();
      email = email.trim();
      password = password.trim();

      // Check if the fields are empty
      if (!(firstName && lastName && email && password)) {
        // sendError({ res, message: "Missing credentials" });
        sendError({ res, message: "Missing credentials" });
        return;
      } else if (
        !(/^[a-zA-Z]*$/.test(firstName) && /^[a-zA-Z]*$/.test(lastName))
      ) {
        sendError({ res, message: "Invalid name entered" });
        return;
      } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        sendError({ res, message: "Enter a valid email address" });
        return;
      } else if (password.lenth > 8) {
        sendError({
          res,
          message: "Password too short! Password must be atleast 8 characters",
        });
        return;
      }

      const newUser = await registerUser({
        res,
        firstName,
        lastName,
        email,
        password,
        roles,
      });

      sendSuccessWithPayload(
        { res, message: "User registered successfully", key: "newUser" },
        newUser
      );
    } catch (error) {
      console.log(error);
      sendError({ res });
    }
  }
);

authRouter.get("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (!email) {
      sendError({ res, code: 401, message: "Email is required" });
      return;
    }

    if (!password) {
      sendError({ res, code: 401, message: "Password is required" });
      return;
    }
    const token = await loginUser({ res, email, password });

    return sendSuccessWithPayload(
      { res, message: "User logged in successfully", key: "token" },
      token
    );
  } catch (error) {
    console.error(error);
    sendError({ res });
  }
});

export default authRouter;
