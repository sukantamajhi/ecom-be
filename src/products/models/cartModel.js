const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
            },
        ],
        totalAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

cartSchema.pre("find", function (next) {
    this.populate("products.product", [
        "_id",
        "name",
        "description",
        "price",
        "imageUrl",
    ]);
    this.populate(user, ["_id", "name", "email"]);
    next();
});

cartSchema.pre("findOne", function (next) {
    this.populate("products.product", [
        "_id",
        "name",
        "description",
        "price",
        "imageUrl",
    ]);
    this.populate(user, ["_id", "name", "email"]);
    next();
});

module.exports = mongoose.model("carts", cartSchema);
