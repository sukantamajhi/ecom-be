const express = require("express")
const services = require("./services")

const router = express.Router()

/**
 * @route - /api/auth/signup
 * @description - This api is for signing up for a new user
 * @body - {name, email, phone, address, password}
 */
router.post("/signup", (req, res) => {
    services.signup(req)
        .then(result => res.status(201).send(result))
        .catch(err => res.status(500).send(err))
})

/**
 * @route - /api/auth/signin
 * @description - This api is for signing in for users
 * @body - {email, phone, password}
 */
router.post("/signin", (req, res) => {
    services.signin(req)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
})

/**
 * @route - /api/auth/forgot-password
 * @description - This api is for forgot password
 * @body - email
 */
router.post("/forgot-password", (req, res) => {
    services.forgotPassword(req)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err))
})

module.exports = router