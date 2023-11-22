const express = require("express")
const verifyToken = require("../middlewares/verifyToken")
const services = require("./services")
const multer = require("multer")

const router = express.Router()

const upload = multer({})

router.post("/add-product", upload.array('files', 4), (req, res) => {
    services.addProduct(req)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err))
})



module.exports = router