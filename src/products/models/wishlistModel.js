const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("wishlists", wishlistSchema);
