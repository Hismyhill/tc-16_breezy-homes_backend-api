import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  hashData,
  sendError,
  sendSuccess,
  sendSuccessWithPayload,
  verifyHashedData,
} from "../utils/helpers.js";

// Ignore self-signed certificates during development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function registerUser(req, res) {
  try {
    let { firstName, lastName, email, password, roles } = req.body;

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();

    // Check if the fields are empty
    if (!(firstName && lastName && email && password)) {
      sendError({ res, message: "Missing credentials" });
    } else if (
      !(/^[a-zA-Z]*$/.test(firstName) && /^[a-zA-Z]*$/.test(lastName))
    ) {
      sendError({ res, code: 400, message: "Invalid name entered" });
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      sendError({ res, code: 400, message: "Enter a valid email address" });
    } else if (password.lenth > 8) {
      sendError({
        res,
        code: 400,
        message: "Password too short! Password must be atleast 8 characters",
      });
    }

    // check if username or passsword been taken
    const checkExistingUser = await User.findOne({
      where: { email },
    });

    if (checkExistingUser) {
      res.status(400).json({
        success: false,
        message: "User with username or email address already exist.",
      });
    }

    const hashedPassword = await hashData(password, 10);

    // upload image to cloudinary
    // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //   resource_type: "image",
    // });
    // const imageURL = imageUpload.secure_url;

    // 2. Create and add the new user
    let newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles: roles || "guest",
    });
    newUser = await newUser.save();

    if (newUser) {
      sendSuccess({ res, message: "User created successfully" });
    } else {
      sendError({ res, code: 400, message: "Unable to create user" });
    }
  } catch (error) {
    console.error(error);
    sendError({ res });
  }
}

// Login a user

// 1. Get the username and password
async function loginUser(req, res) {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      sendError({ res, code: 401, message: "Email or Password is required" });
      return; // Exit early
    }

    // 2. Check if user exist
    const user = await User.findOne({ where: { email } });

    if (!user) {
      sendError({ res, code: 400, message: "User not found" });
      return; // Exit early
    }

    // 3. Compare the password
    const isPasswordMatch = await verifyHashedData(password, user.password);

    if (!isPasswordMatch) {
      sendError({ res, code: 400, message: "Password does not match" });
      return; // Exit early
    }

    // 4. Create an access token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.roles,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    return sendSuccessWithPayload(
      { res, code: 201, message: "User logged in successfully", key: "token" },
      accessToken
    );
  } catch (error) {
    console.error(error);
    sendError({ res });
  }
}

export async function becomeHost(req, res, next) {
  const user = req.user;

  if (!user.roles.includes("host")) {
    const updatedRoles = [...new Set([...user.roles.split(","), "host"])];
    user.roles = updatedRoles.join(",");

    await user.save();
  }

  sendSuccess({ res, message: "You are now a host" });
}

// Update user password
async function updateUserPassword(req, res) {
  try {
    // Get the user Id
    const userId = req.userInfo.userId;

    // Get credentials from the body
    const { oldPassword, newPassword } = req.body;

    // Get the the user object
    const user = await User.findByPk(userId);

    if (!user) {
      sendError({ res, code: 400, message: "User not found." });
    }

    // compare the passwords
    const isPasswordMatch = await verifyHashedData(oldPassword, user.password);

    if (!isPasswordMatch) {
      sendError({
        res,
        code: 400,
        message: "Password does not match! Please try again.",
      });
    }

    // Hash the new password

    const newHashedPassword = await hashData(newPassword, 10);

    user.password = newHashedPassword;
    await user.save();

    sendSuccess({ res, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    sendError({ res });
  }
}

export { registerUser, loginUser, updateUserPassword };
