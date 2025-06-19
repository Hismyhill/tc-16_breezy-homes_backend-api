import express from "express";
import cors from "cors";
import sequelize from "./config/db.config.js";
import bodyParser from "body-parser";

import routes from "./routes.js";

const app = express();

const corOptions = {
  origin: "http://localhost:8081",
};

// middewares

app.use(express.json()); // Ensure this is applied before routes
app.use(cors(corOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
