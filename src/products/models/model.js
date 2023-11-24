const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'productcategories', // Reference to the product category
    }],
    imageUrl: [{
        type: String,
        trim: true,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
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

productSchema.pre("save", function (next) {
    this.populate("createdBy", ["_id", "name", "email"])
    next()
})

productSchema.pre("findOne", function (next) {
    this.populate("createdBy", ["_id", "name", "email"])
    next()
})

productSchema.pre("find", function (next) {
    this.populate("createdBy", ["_id", "name", "email"])
    next()
})

module.exports = mongoose.model("products", productSchema)