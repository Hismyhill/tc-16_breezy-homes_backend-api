import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Review = sequelize.define("Review", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  comment: {
    type: DataTypes.TEXT,
  },

  shortletId: {
    type: DataTypes.INTEGER,
  },
});

export default Review;
