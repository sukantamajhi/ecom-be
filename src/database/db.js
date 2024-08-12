const mongoose = require("mongoose")
const logger = require("../../logger/logger")

function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        logger.info("Database connected successfully")
    }).catch(err => {
        logger.error(err, "<<-- Error in database connection")
    })
}
module.exports = connectToDb