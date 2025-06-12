import nodemailer from "nodemailer";

import OTP from "../models/otpModel.js";
import {
  generateOTP,
  hashData,
  sendError,
  sendSuccessWithPayload,
} from "../utils/helpers.js";

export async function sendOtp(req, res) {
  try {
    const { email, subject, message, duration } = req.body;

    if (!(email && subject && message)) {
      sendError({
        res,
        code: 400,
        message: "Provide values for email, subject and message",
      });
    }

    await OTP.destroy({ where: { email } });

    const generatedOTP = await generateOTP();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SUPER_ADMIN_EMAIL,
        pass: process.env.SUPER_ADMIN_PASSWORD,
      },
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

    sendSuccessWithPayload(
      {
        res,
        message:
          "A OTP has been sent to your registered email. Check your mail",
        key: "OTPRecord",
      },
      createdOTPRecord
    );
  } catch (error) {
    console.log(error);
    sendError({ res });
  }
}

// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("ready for messages");
//     console.log(success);
//   }
// });
