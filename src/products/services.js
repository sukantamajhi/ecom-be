const logger = require("../../logger/logger");
const { createUser, createCharge } = require("../stripeController");
const handleUpload = require("../utils/cloudinary");
const messages = require("../utils/messages.json");
const cartModel = require("./models/cartModel");
const productModel = require("./models/model");
const wishlistModel = require("./models/wishlistModel");

module.exports = {
	addProduct: (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { name, description, price, category } = req.body;
				const { _id } = req.user;
				const images = await Promise.all(
					req.files.map(async (file) => {
						const data = await handleUpload(file);
						return data.secure_url;
					})
				);

				const product = new productModel({
					name,
					description,
					price,
					category,
					imageUrl: images,
					createdBy: _id,
				});

				const newProduct = await product.save();

				return resolve({
					success: true,
					message: messages["PRODUCT_UPLOAD_SUCCESS"],
					result: newProduct,
				});
			} catch (error) {
				logger.error(error, "<<-- Error in add product");
				return reject({
					success: false,
					message: messages["ADD_PRODUCT_FAILED"],
				});
			}
		});
	},

	getAllProducts: (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const products = await productModel
					.find({ createdBy: req.params.userId ?? req.user._id })
					.sort({ createdAt: -1 });

				if (products.length > 0) {
					return resolve({
						success: true,
						message: messages["PRODUCTS_FETCHED"],
						result: products,
					});
				} else {
					return reject({
						success: false,
						message: messages["PRODUCTS_FETCH_FAILED"],
					});
				}
			} catch (error) {
				logger.error(error, "<<-- Error in get all products");
				return reject({
					success: false,
					message: messages["INTERNAL_SERVER_ERROR"],
					err: error.message ?? error.toString(),
				});
			}
		});
	},

	productDetails: (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { productId } = req.params;

				const product = await productModel.findOne({
					_id: productId,
					isDeleted: false,
				});

				if (!product) {
					return reject({
						success: false,
						message: messages["PRODUCT_NOT_FOUND"],
					});
				} else {
					return resolve({
						success: true,
						message: messages["PRODUCT_RETRIEVED_SUCCESSFULLY"],
						result: product,
					});
				}
			} catch (error) {
				logger.error(error, "<<-- Error in getting product details");
				return reject({
					success: false,
					message: messages["INTERNAL_SERVER_ERROR"],
					err: error.message ?? error.toString(),
				});
			}
		});
	},

	updateProduct: async (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { prodId } = req.params;
				const { name, description, price, category, imageUrl } =
					req.body;

				const product = await productModel.findOneAndUpdate(
					{ _id: prodId, isDeleted: false },
					{ $set: { name, description, price, category, imageUrl } },
					{ new: true } // Returns the updated document
				);

				if (!product) {
					return {
						success: false,
						message: messages["PRODUCT_NOT_FOUND"],
					};
				}

				let images = [];

				if (req?.files?.length > 0) {
					images = await Promise.all(
						req.files.map(async (file) => {
							const data = await handleUpload(file);
							return data.secure_url;
						})
					);
				}

				// Combine existing and newly uploaded images
				images = [...images, imageUrl];

				// Update product with the combined images array
				const updatedProd = await productModel.findOneAndUpdate(
					{ _id: prodId },
					{
						$set: {
							name,
							description,
							price,
							category,
							imageUrl,
							images,
						},
					},
					{ new: true }
				);

				if (!updatedProd.acknowledged) {
					return reject({
						success: false,
						message: messages["PRODUCT_UPDATE_FAILED"],
					});
				}

				return resolve({
					success: true,
					message: messages["PRODUCT_UPDATED"],
					result: updatedProd,
				});
			} catch (error) {
				logger.error("Error in update product:", error);
				return reject({
					success: false,
					message: messages["INTERNAL_SERVER_ERROR"],
				});
			}
		});
	},

	delete: async (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { prodIds } = req.body;

				const deletedProds = await productModel.updateMany(
					{
						_id: { $in: prodIds },
						createdBy: req.user._id,
						isDeleted: false,
					},
					{ $set: { isDeleted: true, deletedAt: new Date() } },
					{ multi: true }
				);

				if (deletedProds.nModified > 0) {
					const deletedProducts = await productModel.find({
						_id: { $in: prodIds },
						isDeleted: true,
					});
					return resolve({
						success: true,
						message: messages["PRODUCTS_DELETED_SUCCESS"],
						result: deletedProducts,
					});
				} else {
					return reject({
						success: false,
						message: messages["PRODUCTS_DELETE_FAILED"],
					});
				}
			} catch (error) {
				logger.error("Error in delete product:", error);
				return reject({
					success: false,
					message: messages["INTERNAL_SERVER_ERROR"],
				});
			}
		});
	},

	addToCart: (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { _id } = req.user;
				const { products, totalAmount } = req.body;

				let cart = await cartModel.findOne({ user: _id });

				if (!cart) {
					cart = new cartModel({
						products,
						totalAmount,
						user: _id,
					});

					const savedCart = await cart.save();

					if (!savedCart) {
						return reject({
							success: false,
							message: messages["ITEM_ADD_TO_CART_FAILED"],
						});
					}

					return resolve({
						success: true,
						message: messages["ITEM_ADD_TO_CART_SUCCESS"],
						result: savedCart,
					});
				}

				// Update the cart
				cart.products = products ?? cart.products;
				cart.totalAmount = totalAmount ?? cart.totalAmount;

				const updatedCart = await cart.save();

				if (!updatedCart) {
					return reject({
						success: false,
						message: messages["ITEM_ADD_TO_CART_FAILED"],
					});
				}

				return resolve({
					success: true,
					message: messages["ITEM_ADD_TO_CART_SUCCESS"],
					result: updatedCart,
				});
			} catch (error) {
				logger.error(error, "<<-- Error in product adding to cart");
				return reject({
					success: false,
					message: messages["INTERNAL_SERVER_ERROR"],
					err: error.message ?? error.toString(),
				});
			}
		});
	},

	wishlist: (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { _id } = req.user;
				const { productId } = req.body;
				let userWishlist = await wishlistModel.findOne({ user: _id });

				if (!userWishlist) {
					userWishlist = new wishlistModel({
						productId,
						user: _id,
					});

					const newWishList = await userWishlist.save();

					if (!newWishList) {
						return reject({
							success: false,
							message: messages["ITEM_ADD_TO_WISHLIST_FAILED"],
						});
					} else {
						return resolve({
							success: true,
							message: messages["ITEM_ADD_TO_WISHLIST_SUCCESS"],
							result: newWishList,
						});
					}
				} else {
					// Delete product from wishlist
					await wishlistModel.deleteOne({ productId });

					return resolve({
						success: true,
						message: messages["ITEM_REMOVE_FROM_WISHLIST_SUCCESS"],
					});
				}
			} catch (error) {
				logger.error(error, "<<-- Error in adding product to wishlist");
				return reject({
					success: false,
					message: messages["INTERNAL_SERVER_ERROR"],
					err: error.message ?? error.toString(),
				});
			}
		});
	},

	purchase: (req) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { _id } = req.user;
				const { cardToken } = req.body;
				const cart = await cartModel.findOne({ user: _id });

				if (!cart) {
					return reject({
						success: false,
						message: messages["NO_PRODUCTS_ADDED_TO_CART"],
					});
				} else {
					const stripeCustId = await createUser(_id);
					const charge = await createCharge({
						stripeCustId,
						amount: cart.totalAmount,
						currency: "inr",
						source: cardToken,
					});

					// TODO: Empty cart, save user card

					return resolve({
						success: true,
						message: messages["PRODUCT_PURCHASED"],
					});
				}
			} catch (error) {
				logger.error(error, "<<-- Error in product purchase");
				return resolve({
					success: false,
					message: messages["INTERNAL_SERVER_ERROR"],
					err: error.message ?? error.toString(),
				});
			}
		});
	},
};
