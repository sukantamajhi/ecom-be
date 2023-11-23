const handleUpload = require("../utils/cloudinary")
const messages = require("../utils/messages.json")
const productModel = require("./model")

module.exports = {
    addProduct: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { name, description, price, category } = req.body
                const { _id } = req.user
                const images = await Promise.all(req.files.map(async file => {
                    const data = await handleUpload(file)
                    return data.secure_url
                }))

                const product = new productModel({
                    name, description, price, category, imageUrl: images, createdBy: _id
                })

                const newProduct = await product.save()

                return resolve({
                    success: true,
                    message: messages["PRODUCT_UPLOAD_SUCCESS"],
                    result: newProduct
                })
            } catch (error) {
                console.error(error, "<<-- Error in add product")
                return reject({
                    success: false,
                    message: messages["ADD_PRODUCT_FAILED"]
                })
            }
        })
    },

    getAllProducts: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await productModel.find({})

                if (products.length > 0) {
                    return resolve({
                        success: true,
                        message: messages["PRODUCTS_FETCHED"],
                        result: products
                    })
                } else {
                    return reject({
                        success: false,
                        message: messages["PRODUCTS_FETCH_FAILED"]
                    })
                }
            } catch (error) {
                console.error(error, "<<-- Error in get all products")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"],
                    err: error.message ?? error.toString()
                })
            }
        })
    },

    updateProduct: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { prodId } = req.params
                const { name, description, price, category, imageUrl } = req.body

                const product = await productModel.findOne({ _id: prodId, isDeleted: false })

                if (!product) {
                    return reject({
                        success: false,
                        message: messages["PRODUCT_NOT_FOUND"]
                    })
                } else {
                    const updatedProd = await productModel.updateOne({ _id: prodId }, { $set: { name, description, price, category, imageUrl } })

                    if (!updatedProd.acknowledged) {
                        return reject({
                            success: false,
                            message: messages["PRODUCT_UPDATE_FAILED"]
                        })
                    } else {
                        const product = await productModel.findOne({ _id: prodId })

                        return resolve({
                            success: true,
                            message: messages["PRODUCT_UPDATED"],
                            result: product
                        })
                    }
                }

            } catch (error) {
                console.error(error, "<<-- Error in update product")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"]
                })
            }
        })
    },

    // delete: (req) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {

    //         } catch (error) {
    //             console.error(error, "<<-- Error in ")
    //         }
    //     })
    // }
}