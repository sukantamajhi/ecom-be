const express = require("express")
const services = require("./services")
const verifyToken = require("../middlewares/verifyToken")
const router = express.Router()

/**
 * @route - "/api/users/"
 * @description - This api is for getting all users
 */
router.get("/", verifyToken, (req, res) => {
    services.getAllUsers(req)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
})

module.exports = router