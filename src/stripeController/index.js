const userModel = require("../auth/model");
const logger = require("../../logger/logger");
const config = require("../config");
const messages = require("../utils/messages.json");

const stripe = require("stripe")(config.sk);

const createUser = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await userModel.findOne({
				_id: userId,
				isDeleted: false,
			});

			if (!user) {
				return reject({
					error: true,
					message: messages["USER_NOT_FOUND"],
				});
			} else {
				if (user.stripeCustId) {
					return resolve({
						error: false,
						stripeCustId: user.stripeCustId,
					});
				} else {
					const newStripeUser = await stripe.customers.create({
						name: user.name,
						email: user.email,
					});

					if (!newStripeUser) {
						return reject({
							error: true,
							message: messages["STRIPE_USER_CREATE_FAILED"],
						});
					} else {
						await userModel.findOneAndUpdate(
							{ _id: userId },
							{ stripeCustId: newStripeUser.id },
							{ new: true }
						);
						return resolve({
							error: false,
							stripeCustId: newStripeUser.id,
						});
					}
				}
			}
		} catch (error) {
			logger.error(error, "<<-- Error in stripe user create");
			return reject({
				error: true,
				err: error,
			});
		}
	});
};

const createCharge = ({ stripeCustId, amount, currency, source }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const newCharge = await stripe.charge.create({
				customer: stripeCustId,
				amount,
				currency,
				source,
				description: "New Purchase",
			});

			if (!newCharge) {
				return reject({
					error: true,
					message: messages["CHARGE_CREATE_FAILED"],
				});
			} else {
				return resolve({
					error: false,
					result: newCharge,
				});
			}
		} catch (error) {
			logger.error(error, "<<-- Error in create charge");
			return reject({
				error: true,
				err: error,
			});
		}
	});
};

module.exports = { createUser, createCharge };
