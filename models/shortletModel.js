import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Shortlet = sequelize.define("Shortlet", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  images: {
    type: DataTypes.JSON,
  },

  listed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  location: {
    type: DataTypes.STRING,
  },

  userId: {
    type: DataTypes.INTEGER,
  },
});

export default Shortlet;
