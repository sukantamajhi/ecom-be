const express = require("express")
const AuthRouter = require("../auth")
const UserRouter = require("../users")
const ProductRouter = require("../products")

const router = express.Router()

router.use("/auth", AuthRouter)
router.use("/users", UserRouter)
router.use("/products", ProductRouter)

module.exports = router