import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";

import sequelize from "./config/db.config.js";
import { specs } from "./config/swagger.js";
import { connectDB } from "./config/db.config.js";
import errorHandler from "./utils/errorHandler.js";
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

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Routes
app.use("/api/v1", routes);

// Error handling
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  sendError({ res, code: 404, message: "Route not found" });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `Swagger documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection failed:", error));

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
