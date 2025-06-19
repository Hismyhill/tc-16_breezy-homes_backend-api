import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";
import Shortlet from "./shortletModel.js";

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  roles: {
    type: DataTypes.STRING,
    defaultValue: "guest",
  },

  username: {
    type: DataTypes.STRING
      },

  phoneNumber: {
    type: DataTypes.STRING,
      },


  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  fontSize: {
    type: DataTypes.STRING,
    defaultValue: "Medium",
  },

  contrastMode: {
    type: DataTypes.STRING,
    defaultValue: "Light",
  }
});

User.hasMany(Shortlet, {
  foreignKey: "userId",
  as: "shortlet",
  onDelete: "CASCADE",
});

Shortlet.belongsTo(User, { foreignKey: "userId", as: "user" });

export default User;
