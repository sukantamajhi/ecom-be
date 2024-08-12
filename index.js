const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const connectToDb = require("./src/database/db");
const router = require("./src/routes");
const cors = require("cors");
const config = require("./src/config");
const logger = require("./logger/logger");
const swaggerFile = require("./swagger_output.json");
const swaggerUi = require('swagger-ui-express')

const app = express();

app.use(express.json());

const whitelist = [
  "http://localhost:8080",
  "http://localhost:8001",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(cors(whitelist));

if (config.nodeEnv !== "production") {
  app.use(morgan("tiny"));
}

connectToDb();

app.use("/api", router);

app.get("/", (req, res) => {
  res.json("Hello world");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(4000, () => {
  logger.info("Server is running on port 4000");
});
