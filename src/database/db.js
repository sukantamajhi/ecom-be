const mongoose = require("mongoose")

function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("🚀 Database connected successfully 🚀")
    }).catch(err => {
        console.error(err, "<<-- Error in database connection")
    })
}
module.exports = connectToDb