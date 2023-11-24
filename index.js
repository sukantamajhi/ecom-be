const express = require("express")
const morgan = require("morgan")
require("dotenv").config()
const connectToDb = require("./src/database/db")
const router = require("./src/routes")
const cors = require("cors")
const config = require("./src/config")
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const logger = require("./logger/logger")

const app = express()

app.use(express.json())
app.use(cors())

if (config.nodeEnv !== "production") {
    app.use(morgan("tiny"))
}

connectToDb()

app.use("/api", router)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.get("/", (req, res) => {
    res.json("Hello world")
})

app.listen(4000, () => {
    logger.info("⚡️ Server is running on port 4000 ⚡️")
})