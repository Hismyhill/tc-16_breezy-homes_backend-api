import User from "../models/userModel.js";
import { hashData } from "../utils/helpers.js";
import { deleteOTP, sendOTP, verifyOTP } from "./otpController.js";

export async function forgotPasswordOTP(email) {
  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) throw new Error("User with email not found!");

    if (!existingUser.isVerified)
      throw new Error(
        "Your account is not verified yet! Please check your inbox"
      );

    const OTPDetails = {
      message: "You requested for a password reset. Use the code below.",
      subject: "Password reset request",
      duration: 6,
      email,
    };

    const createdOTP = await sendOTP(OTPDetails);

    return createdOTP;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

export async function resetUserPassword({ email, newPassword, otp }) {
  try {
    const validOTP = await verifyOTP({ email, otp });

    if (!validOTP)
      throw new Error("Wrong code provided, please check your inbox.");

    if (newPassword.lenght < 8) throw new Error("Password length too short");

    const hashednewPassword = await hashData(newPassword);

    await User.findOne({ password: hashednewPassword }, { where: { email } });
    await deleteOTP(email);
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}
