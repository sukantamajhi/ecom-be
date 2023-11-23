const categoryModel = require("./model")
const messages = require("../utils/messages.json")
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
                            message: messages["CATEGORY_CREATED"]
                        })
                    }
                } else {
                    return reject({
                        success: false,
                        message: messages["CATEGORY_EXISTS"]
                    })
                }
            } catch (error) {
                console.error(error, "<<-- Error in category create")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"]
                })
            }
        })
    },

    getAllCategories: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { search } = req.query

                let query = {
                    isDeleted: false
                }

                if (search) {
                    query
                }

                const categories = await categoryModel.find({ isDeleted: false }).sort({ createdAt: -1 })

                if (categories?.length > 0) {
                    return resolve({
                        success: true,
                        message: messages["CATEGORY_RETRIEVED"],
                        result: categories
                    })
                } else {
                    return reject({
                        success: false,
                        message: messages["NO_CATEGORIES_FOUND"]
                    })
                }
            } catch (error) {
                console.error(error, "<<-- Error in get all categories")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"],
                    err: error.message ?? error.toString()
                })
            }
        })
    },

    updateCategory,

    deleteCategory
}