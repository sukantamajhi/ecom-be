const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const services = require("./services");
const multer = require("multer");

const router = express.Router();

const upload = multer({});

// Using a global middleware for these routes
router.use(verifyToken);

/**
 * @sukantamajhi
 * @route - POST /api/products/add-product
 * @description - Add a new product with the option to upload up to 8 images.
 * @access - Private (requires authentication)
 * @body - { name: string, description: string, price: string, category: string, files: array }
 * @file - files
 */
router.post("/add-product", upload.array("files", 8), (req, res) => {
    services
        .addProduct(req)
        .then((result) => res.status(201).send(result))
        .catch((err) => res.status(500).send(err));
});

/**
 * @sukantamajhi
 * @route - GET /api/products/:userId?
 * @description - Retrieve products associated with a user.
 * @access - Private (requires authentication)
 * @param {string} req.params.userId - Optional. The ID of the user whose products are to be retrieved.
 */
router.get("/:userId?", (req, res) => {
    services
        .getAllProducts(req)
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(500).send(err));
});

/**
 * @sukantamajhi
 * @route - GET /api/products/:productId
 * @description - Getting product details
 * @access - Private (Requires Authentication)
 * @param {string} req.params.productId - Optional. The ID of the product is to be retrieved.
 */
router.get("/:productId", (req, res) => {
    services
        .productDetails(req)
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(500).send(err));
});
/**
 * @sukantamajhi
 * @route - PUT /api/products/:prodId
 * @description - Update a product by its ID.
 * @access Private (requires authentication)
 * @param {string} req.params.prodId - The ID of the product to be updated.
 * @body - {name, description, price, category, imageUrl}
 */
router.put("/:prodId", upload.array("files", 4), (req, res) => {
    services
        .updateProduct(req)
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(500).send(err));
});

/**
 * @sukantamajhi
 * @route - DELETE /api/products
 * @description - Delete a product.
 * @access - Private (requires authentication)
 * @body - array of productIds as prodIds for multiple delete
 */
router.delete("/", (req, res) => {
    services
        .delete(req)
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(500).send(err));
});

/**
 * @sukantamajhi
 * @route - POST /api/products/cart
 * @description - Add/Update products to cart
 * @access - Private (Requires Authentication)
 * @body - {products<{product:String, quantity: Number}>[], totalAmount:Number}
 */
router.post("/cart", (req, res) => {
    services
        .addToCart(req)
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(500).send(err));
});

/**
 * @sukantamajhi
 * @route - POST /api/products/wishlist
 * @description - Add/remove products to wishlist
 * @access - Private (Requires Authentication)
 * @body - {products<{product:String, quantity: Number}>[], totalAmount:Number}
 */
router.post("/wishlist", (req, res) => {
    services
        .wishlist(req)
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(500).send(err));
});

// Product purchase
router.post("/purchase", (req, res)=>{
    services
        .purchase(req)
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(500).send(err));
})

module.exports = router;
