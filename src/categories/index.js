const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const services = require("./services");
const router = express.Router()


/**
 * @route POST /api/categories
 * @description Create a new category.
 * @access Private (requires authentication)
 * @function
 * @name createCategory
 */
router.post("/", verifyToken, (req, res) => {
    services.createCategory(req)
        .then(result => res.status(201).send(result))
        .catch(err => res.status(500).send(err))
});

/**
 * @route GET /api/categories
 * @description Get all categories.
 * @access Public
 * @function
 * @name getAllCategories
 */
router.get("/", (req, res) => {
    services.getAllCategories(req)
        .then(categories => res.status(200).send(categories))
        .catch(err => res.status(500).send(err));
});

/**
 * @route PUT /api/categories/:categoryId
 * @description Update a category by its ID.
 * @access Private (requires authentication)
 * @function
 * @name updateCategory
 */
router.put("/:categoryId", verifyToken, (req, res) => {
    services.updateCategory(req)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
});

/**
 * @route DELETE /api/categories/:categoryId
 * @description Delete a category by its ID.
 * @access Private (requires authentication)
 * @function
 * @name deleteCategory
 */
// router.delete("/:categoryId", verifyToken, (req, res) => {
//     services.deleteCategory(req)
//         .then(() => res.status(200).send({ message: "Category deleted successfully." }))
//         .catch(err => res.status(500).send(err))
// });

module.exports = router