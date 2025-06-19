import express from "express";

import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import OTPRouter from "./routes/otpRoutes.js";
import shortletRouter from "./routes/shortletRoutes.js";
import emailVerificationRouter from "./routes/emailVerificationRoutes.js";
import forgotPasswordRouter from "./routes/forgotPasswordRoutes.js";

const routes = express.Router();
routes.use("/admi", adminRouter);
routes.use("/user", authRouter);
routes.use("/otp", OTPRouter);
routes.use("/shortlet", shortletRouter);
routes.use("/email_verification", emailVerificationRouter);
routes.use("/forgot_password", forgotPasswordRouter);

export default routes;
