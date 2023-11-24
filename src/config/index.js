require("dotenv").config()

const config = {
    logLevel: process.env.LOGLEVEL || "error",
    mongodbUri: process.env.MONGODB_URI || "",
    nodeEnv: process.env.NODE_ENV || "",
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "",
    cloudName: process.env.CLOUD_NAME || "",
    apiKey: process.env.API_KEY || "",
    apiSecret: process.env.API_SECRET || "",
    pk: process.env.STRIPE_PUBLISHABLE_KEY || "",
    sk: process.env.STRIPE_SECRET_KEY || ""
}

module.exports = config