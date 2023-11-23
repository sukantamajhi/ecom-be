const mongoose = require("mongoose")

const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'productcategories', // Reference to itself for nested categories
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

module.exports = mongoose.model("productcategories", categorySchema)