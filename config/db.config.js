import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(

  process.env.DB_URL,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: Boolean(process.env.DB_LOGGING),
  }
);

export default sequelize;
