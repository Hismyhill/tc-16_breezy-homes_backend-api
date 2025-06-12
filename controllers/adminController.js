import jwt from "jsonwebtoken";

import {
  sendError,
  sendSuccess,
  sendSuccessWithPayload,
} from "../utils/helpers.js";
import User from "../models/userModel.js"

//  API for Admin login
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      sendSuccessWithPayload(
        {
          res,
          code: 200,
          message: "You're logged in successfully",
          key: "token",
        },
        token
      );
    } else {
      sendError({
        res,
        code: 401,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    sendError({
      res,
      code: 500,
    });
  }
}

export async function getUsers(req, res) {
  try {
    const doctors = await User.find({}).select("-password");

    if (doctors.length === 0) {
      return sendError({
        res,
        code: 404,
        message: "No doctors found! Start adding doctors.",
      });
    }

    return sendSuccess(doctors, {
      res,
      code: 200,
      success: true,
      message: "Doctors fetched successfully",
    });
  } catch (error) {
    sendError({
      res,
      code: 500,
    });
  }
}

export async function changeAvalability(req, res) {
  try {
    const { docId } = req.body;
    const docData = await Doctor.findById(docId);
    await Doctor.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.status(200).json({
      status: true,
      message: "Doctor availability updated successfully",
    });
  } catch (error) {
    console.log(error);
    sendError({
      res,
    });
  }
}
