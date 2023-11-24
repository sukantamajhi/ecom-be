const categoryModel = require("./model")
const messages = require("../utils/messages.json")
const logger = require("../../logger/logger")
module.exports = {
    createCategory: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { name, description, parentCategory } = req.body
                const category = await categoryModel.findOne({ name: name.toLowerCase(), isDeleted: false })
                if (!category) {
                    let newCategory = new categoryModel({
                        name: name.toLowerCase(), description, parentCategory
                    })

                    newCategory = await newCategory.save()

                    if (!newCategory) {
                        return reject({
                            success: false,
                            message: messages["CATEGORY_CREATE_FAILED"]
                        })
                    } else {
                        return resolve({
                            success: true,
                            message: messages["CATEGORY_CREATED"],
                            result: newCategory
                        })
                    }
                } else {
                    return reject({
                        success: false,
                        message: messages["CATEGORY_EXISTS"]
                    })
                }
            } catch (error) {
                logger.error(error, "<<-- Error in category create")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"]
                })
            }
        })
    },

    getAllCategories: async (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { search } = req.query;

                const query = {
                    isDeleted: false,
                    ...(search && { name: { $regex: search, $options: "i" } })
                };

                const categories = await categoryModel.find(query).sort({ createdAt: -1 });

                if (categories.length > 0) {
                    return resolve({
                        success: true,
                        message: messages["CATEGORIES_RETRIEVED_SUCCESS"],
                        result: categories
                    });
                } else {
                    return resolve({
                        success: false,
                        message: messages["NO_CATEGORIES_FOUND"]
                    });
                }
            } catch (error) {
                logger.error("Error in get all categories:", error);
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"],
                    err: error.message || error.toString()
                });
            }
        })
    },

    updateCategory: async (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { prodId } = req.params;
                const { name, description, parentCategory } = req.body;

                const category = await categoryModel.findOneAndUpdate(
                    { _id: prodId, isDeleted: false },
                    { $set: { name, description, parentCategory } },
                    { new: true } // Returns the updated document
                );

                if (!category) {
                    return reject({
                        success: false,
                        message: messages["CATEGORY_NOT_FOUND"]
                    });
                }

                return resolve({
                    success: true,
                    message: messages["CATEGORY_UPDATED_SUCCESS"],
                    result: category
                });
            } catch (error) {
                logger.error("Error in update category:", error);
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"]
                });
            }
        })
    },

    deleteCategory: async (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { catIds } = req.body;

                // Check if catIds is an array and contains at least one element
                if (!Array.isArray(catIds) || catIds.length === 0) {
                    return {
                        success: false,
                        message: messages["INVALID_CATEGORY_IDS"]
                    };
                }

                // Update the categories to mark them as deleted
                const result = await categoryModel.updateMany(
                    { _id: { $in: catIds }, isDeleted: false },
                    { $set: { isDeleted: true, deletedAt: new Date() } }
                );

                if (result.nModified > 0) {
                    return resolve({
                        success: true,
                        message: messages["CATEGORIES_DELETED_SUCCESS"]
                    });
                } else {
                    return reject({
                        success: false,
                        message: messages["CATEGORIES_DELETE_FAILED"]
                    });
                }
            } catch (error) {
                logger.error("Error in delete category:", error);
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"]
                });
            }
        })
    }
}