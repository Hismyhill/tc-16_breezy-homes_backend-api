import bcrypt from "bcryptjs";

export function sendSuccess({ res, code = 200, message }) {
  res.status(code).json({
    success: true,
    message,
  });
}

export function sendSuccessWithPayload(
  { res, code = 201, message, key },
  payload
) {
  res.status(code).json({
    success: true,
    message,
    [key]: payload,
  });
}

export function sendError({
  res,
  code = 500,
  message = "Something went wrong!",
}) {
  if (res.headersSent) {
    console.error("Response already sent. Cannot set headers again.");
    return;
  }
  res.status(code).json({
    success: false,
    message,
  });
}

export async function generateOTP() {
  try {
    const otp = `${1000 + Math.floor(Math.random() * 9000)}`;
    return otp;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate OTP");
  }
}

export async function hashData(data, salt = 10) {
  try {
    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  } catch (error) {
    console.log(error);
  }
}

export async function verifyHashedData(unhashed, hashed) {
  try {
    const isMatch = await bcrypt.compare(unhashed, hashed);

    return isMatch;
  } catch (error) {
    console.log(error);
  }
}
