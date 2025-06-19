import nodemailer from "nodemailer";

import OTP from "../models/otpModel.js";
import {
  generateOTP,
  hashData,
  sendError,
  sendSuccessWithPayload,
  verifyHashedData,
} from "../utils/helpers.js";

export async function sendOTP({ res, email, subject, message, duration = 6 }) {
  try {
    await OTP.destroy({ where: { email } });

    const generatedOTP = await generateOTP();

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SUPER_ADMIN_EMAIL,
        pass: process.env.SUPER_ADMIN_PASSWORD,
      },
    });

    transporter.verify((error, success) => {
      if (error) console.log(error);
      else {
        console.log("Ready for messages");
        console.log(success);
      }
    });

    const mailOptions = {
      from: process.env.SUPER_ADMIN_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This code <b>expires in ${duration} hours</b>.</p>`,
    };

    await transporter.sendMail(mailOptions);

    const hashedOTP = await hashData(generatedOTP);

    const newOTP = new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });

    const createdOTPRecord = await newOTP.save();

    return createdOTPRecord;
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
}

export async function verifyOTP({ res, email, otp }) {
  try {
    const matchedOTPRecord = await OTP.findOne({ where: { email } });

    if (!matchedOTPRecord) {
      sendError({ res, message: "No OTP record found." });
      return;
    }

    const { expiresAt } = matchedOTPRecord;

    if (expiresAt < Date.now()) {
      await OTP.destroy({ email });
      return sendError({
        res,
        message: "Code has expired. Request for a new one.",
      });
    }
    const hashedOtp = matchedOTPRecord.otp;

    const ValidOtp = await verifyHashedData(otp, hashedOtp);

    return ValidOtp;
  } catch (error) {
    console.log(error);
    sendError({ res, message: error.message });
  }
}

export async function deleteOTP(email) {
  try {
    await OTP.destroy({ where: { email } });
  } catch (error) {
    console.log(error);
  }
}
