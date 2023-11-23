require("dotenv").config()

const config = {
    mongodbUri: process.env.MONGODB_URI || "",
    nodeEnv: process.env.NODE_ENV || "",
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "",
    cloudName: process.env.CLOUD_NAME || "",
    apiKey: process.env.API_KEY || "",
    apiSecret: process.env.API_SECRET || ""
}

module.exports = config