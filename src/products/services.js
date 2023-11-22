const messages = require("../utils/messages.json")
const { v2: cloudinary } = require("cloudinary")

module.exports = {
    addProduct: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Promise.all(req.files.map(file => {
                    console.log(file.buffer, file.originalname, "<<-- file")




                }))
                return resolve({
                    success: true,
                    message: messages["PRODUCT_UPLOAD_SUCCESS"],
                    result
                })
            } catch (error) {
                console.error(error, "<<-- Error in add product")
                return reject({
                    success: false,
                    message: messages["ADD_PRODUCT_FAILED"]
                })
            }
        })
    }
}