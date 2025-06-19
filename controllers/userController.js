import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {
  hashData,
  sendSuccess,
  sendError,
  verifyHashedData,
} from "../utils/helpers.js";

export async function becomeHost(req, res, next) {
  const user = req.user;

  if (!user.roles.includes("host")) {
    const updatedRoles = [...new Set([...user.roles.split(","), "host"])];
    user.roles = updatedRoles.join(",");

    await user.save();
  }

  sendSuccess({ res, message: "You are now a host" });

  next();
}

export async function updateUserSetting({ res, req }) {
  try {
    const user = req.user;

    const { firstName, lastName, phoneNumber, fontSize, contrastMode } =
      req.body;

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.fontSize = fontSize || user.fontSize;
    user.contrastMode = contrastMode || user.contrastMode;

    return await user.save();
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

// export async function addShortlet(req, res) {
//   try {
//     // Ensure req.body exists
//     if (!req.body) {
//       sendError({ res, code: 400, message: "Request body is missing." });
//       return;
//     }

//     const { title, description, price } = req.body;
//     const images = req.files; // Assuming images are uploaded via `req.files`

//     // Validate input fields
//     if (!(title && description && price && images && images.length === 3)) {
//       sendError({
//         res,
//         code: 400,
//         message:
//           "Title, description, price, and exactly 3 images are required.",
//       });
//       return;
//     }

//     // ...existing code...
//   } catch (error) {
//     console.error(error);
//     sendError({ res });
//   }
// }

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
