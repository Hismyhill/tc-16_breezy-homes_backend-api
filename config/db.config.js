import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: process.env.DB_DIALECT || "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Disable SSL validation
    },
  },
  logging: Boolean(process.env.DB_LOGGING),
});


export default sequelize;
