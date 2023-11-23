const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "moderator", "admin", "manager", "retailer"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("users", userSchema)