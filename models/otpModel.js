import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const OTP = sequelize.define("OTP", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  createdAt: {
    type: DataTypes.DATE,
  },

  expiresAt: {
    type: DataTypes.DATE,
  },
});

export default OTP;
