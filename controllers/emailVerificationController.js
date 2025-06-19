import User from "../models/userModel.js";
import { sendError } from "../utils/helpers.js";
import { deleteOTP, sendOTP, verifyOTP } from "./otpController.js";

export async function sendVerificationEmail({ res, email }) {
  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      sendError({
        res,
        code: 404,
        message: "There's no account for the provided email",
      });
      return;
    }
    const otpDetails = {
      email,
      subject: "Account Verification",
      message: `Hi ${existingUser.firstName}, \n To verify your account. Please use the code below`,
      duration: 6,
      res,
    };

    const createdOTP = await sendOTP(otpDetails);
    return createdOTP;
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

export async function verifyUserEmail({ res, email, otp }) {
  try {
    const validOTP = await verifyOTP({ res, email, otp });

    if (!validOTP) {
      sendError({
        res,
        code: 401,
        message: "There's no account for the provided email",
      });
      return;
    }

    await User.update({ isVerified: true }, { where: { email } });

    await deleteOTP(email);
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
}
