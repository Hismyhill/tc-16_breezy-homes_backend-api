import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/userModel.js";
import { sendVerificationEmail } from "./emailVerificationController.js";
import { hashData, sendError, verifyHashedData } from "../utils/helpers.js";

// Set NODE_TLS_REJECT_UNAUTHORIZED to "0" only in development phase
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function registerUser({
  res,
  firstName,
  lastName,
  email,
  password,
  roles,
}) {
  try {
    // check if email been taken
    const checkExistingUser = await User.findOne({
      where: { email },
    });

    if (checkExistingUser) {
      sendError({
        res,
        code: 406,
        message: "User with  email address already exist.",
      });
      return;
    }
    const hashedPassword = await hashData(password);

    // 2. Create and add the new user
    let newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles: roles || "guest",
    });
    newUser = await newUser.save();

    await sendVerificationEmail({ res, email });

    return newUser;
  } catch (error) {
    console.error(error);
    sendError({ res });
  }
}

// Login a user

// 1. Get the username and password
export async function loginUser({ res, email, password }) {
  try {
    // 2. Check if user exist
    const user = await User.findOne({ where: { email } });

    if (!user) {
      sendError({
        res,
        code: 404,
        message: "User with email address not found",
      });

      return;
    }

    if (!user.isVerified) {
      sendError({
        res,
        code: 403,
        message: "Account has not been verified. Please check your inbox.",
      });
      return;
    }

    // 3. Compare the password
    const isPasswordMatch = await verifyHashedData(password, user.password);

    if (!isPasswordMatch) {
      sendError({
        res,
        code: 404,
        message: "Password does not match",
      });

      return;
    }

    const payload = {
      userId: user.id,
      email: user.email,
      roles: user.roles,
    };

    // 4. Create an access token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "45m",
    });

    return accessToken;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      sendError({
        res,
        code: 401,
        message: "Session expired. Please log in again.",
      });
    } else {
      console.error(error);
      sendError({ res });
    }
  }
}

// // Update user password
// async function updateUserPassword(req, res) {
//   try {
//     // Get the user Id
//     const userId = req.userInfo.userId;

//     // Get credentials from the body
//     const { oldPassword, newPassword } = req.body;

//     // Get the the user object
//     const user = await User.findByPk(userId);

//     if (!user) {
//       sendError({ res, code: 400, message: "User not found." });
//     }

//     // compare the passwords
//     const isPasswordMatch = await verifyHashedData(oldPassword, user.password);

//     if (!isPasswordMatch) {
//       sendError({
//         res,
//         code: 400,
//         message: "Password does not match! Please try again.",
//       });
//     }

//     // Hash the new password

//     const newHashedPassword = await hashData(newPassword, 10);

//     user.password = newHashedPassword;
//     await user.save();

//     sendSuccess({ res, message: "Password updated successfully" });
//   } catch (error) {
//     console.error(error);
//     sendError({ res });
//   }
// }
