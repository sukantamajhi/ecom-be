const { v2: cloudinary } = require("cloudinary");
const config = require("../config");

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
});

const handleUpload = (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const b64 = Buffer.from(file.buffer).toString("base64");
            let dataURI = "data:" + file.mimetype + ";base64," + b64;

            cloudinary.uploader.upload(dataURI, { public_id: file.originalname }, function (error, result) {
                if (error) {
                    logger.error(error, "<<-- Error in image upload")
                    return reject(error)
                } else {
                    logger.info(result, "<<-- result after image upload")
                    return resolve(result)
                }
            })
        } catch (error) {
            logger.error(error, "<<-- Error in file upload to cloudinary")
            return reject(error)
        }
    })
}

module.exports = handleUpload