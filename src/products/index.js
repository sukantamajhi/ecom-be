const express = require("express")
const verifyToken = require("../middlewares/verifyToken")
const services = require("./services")
const multer = require("multer")

const router = express.Router()

const upload = multer({})

/**
 * @route - POST /api/products/add-product
 * @description - Add a new product with the option to upload up to 8 images.
 * @access - Private (requires authentication)
 * @body - { name: string, description: string, price: string, category: string }
 * @file - files
 */
router.post("/add-product", verifyToken, upload.array('files', 8), (req, res) => {
    services.addProduct(req)
        .then(result => res.status(201).send(result))
        .catch(err => res.status(500).send(err))
})

/**
 * @route - GET /api/products/:userId?
 * @description - Retrieve products associated with a user.
 * @access - Private (requires authentication)
 * @param {string} req.params.userId - Optional. The ID of the user whose products are to be retrieved.
 */
router.get("/:userId?", verifyToken, (req, res) => {
    services.getAllProducts(req)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
})

/**
 * @route - PUT /api/products/:prodId
 * @description - Update a product by its ID.
 * @access Private (requires authentication)
 * @param {string} req.params.prodId - The ID of the product to be updated.
 * @body - {name, description, price, category, imageUrl}
 */
router.put("/:prodId", verifyToken, upload.array('files', 4), (req, res) => {
    services.updateProduct(req)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
})

/**
 * @route - DELETE /api/products
 * @description - Delete a product.
 * @access - Private (requires authentication)
 * @body - array of productIds as prodIds for multiple delete
 */
router.delete("/", verifyToken, (req, res) => {
    services.delete(req)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
})

module.exports = router