const { v2: cloudinary } = require("cloudinary");
const config = require("../config");
const logger = require("../../logger/logger");

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

/**
 * Handles the upload of an image to Cloudinary.
 * @param {Object} file - The file object from a form upload.
 * @param {string} folder - The folder where the image should be uploaded.
 * @returns {Promise<Object>} - A promise that resolves with the upload result.
 */
const handleUpload = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;

      cloudinary.uploader.upload(
        dataURI,
        { public_id: file.originalname, folder: "ECOM_BE" },
        function (error, result) {
          if (error) {
            logger.error(error, "<<-- Error in image upload");
            return reject(error);
          } else {
            return resolve(result);
          }
        }
      );
    } catch (error) {
      logger.error(error, "<<-- Error in file upload to cloudinary");
      return reject(error);
    }
  });
};

module.exports = handleUpload;
