const jwt = require("jsonwebtoken")
const config = require("../config")
const userModel = require("../auth/model")

const verifyToken = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        if (!req.headers.authorization) {
            return res.status(404).json({
                status: false,
                message: "Token not found"
            })
        } else {
            try {
                const decoded = jwt.verify(req.headers.authorization, config.jwtPrivateKey)

                if (!decoded) {
                    return res.status(400).json({
                        status: false,
                        message: "Token not valid"
                    })
                } else {
                    const user = await userModel.findOne({ _id: decoded._id })

                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            message: "User not found"
                        })
                    } else {
                        req.user = user
                    }
                }

                next()
            } catch (error) {
                console.error(error, "<<-- Error in verifying token")
                return res.status(400).send({
                    success: false,
                    message: "Incorrect token",
                    err: error.message ?? error.toString()
                })
            }
        }
    })
}

module.exports = verifyToken