const express = require("express")
const AuthRouter = require("../auth")
const UserRouter = require("../users")
const ProductRouter = require("../products")
const CategoryRouter = require("../categories")

const router = express.Router()

router.use("/auth", AuthRouter
    /* 
        #swagger.tags = ['Auth']
    
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
)
router.use("/users", UserRouter
    /* 
        #swagger.tags = ['User']
    
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
)
router.use("/products", ProductRouter
    /*
        #swagger.tags = ['Product']
    
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
)
router.use("/categories", CategoryRouter
    /*
        #swagger.tags = ['Category']
    
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
)

module.exports = router