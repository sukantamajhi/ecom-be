const messages = require("../utils/messages.json")
const userModel = require("./model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../config")
const { nanoid } = require("nanoid")

module.exports = {
    signup: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { name, email, phone, address, password } = req.body
                // Check user is already in the system or not
                const user = await userModel.findOne({ email, isDeleted: false });

                if (!user) {
                    // Encrypt the password
                    const saltRound = 10;
                    const hashPass = bcrypt.hashSync(password, saltRound)

                    // Create a new user
                    const newUser = new userModel({
                        name, email, phone, address, password: hashPass
                    })

                    const savedUser = await newUser.save();

                    if (!savedUser) {
                        return reject({
                            success: false,
                            message: messages["USER_CREATE_FAILED"]
                        })
                    } else {
                        return resolve({
                            success: true,
                            message: messages["USER_CREATED_SUCCESS"],
                            data: savedUser
                        })
                    }
                } else {
                    // Returning error that user is existed
                    return reject({
                        success: false,
                        message: messages["USER_EXISTS"]
                    })
                }
            } catch (error) {
                console.error(error, "<<-- error in user signup")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"],
                    err: error.message ?? error.toString()
                })
            }
        })
    },

    signin: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { email, phone, password } = req.body
                // Search for a user using email id or phone number
                const user = await userModel.findOne({ $or: [{ email }, { phone }] })

                // If not found then return or check password
                if (!user) {
                    return reject({
                        success: false,
                        message: messages["USER_NOT_FOUND"]
                    })
                } else {
                    const checkPass = bcrypt.compareSync(password, user.password)

                    // if checkPass true then return success with access_token or return password mismatch
                    if (checkPass) {
                        const token = jwt.sign({ email: user.email, _id: user._id }, config.jwtPrivateKey, { expiresIn: "7d" })

                        return resolve({
                            success: true,
                            message: messages["USER_LOGGEDIN_SUCCESS"],
                            access_token: token
                        })
                    } else {
                        return reject({
                            success: false,
                            message: messages["PASSWORD_MISMATCH_ERROR"]
                        })
                    }
                }
            } catch (error) {
                console.error(error, "<<-- error in user sign in")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"],
                    err: error.message ?? error.toString()
                })
            }
        })
    },

    forgotPassword: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { email } = req.body
                const user = await userModel.findOne({ email })

                if (!user) {
                    return reject({
                        success: false,
                        message: messages["USER_NOT_FOUND"]
                    })
                } else {
                    const newPassword = "12345678"

                    const saltRound = 10;
                    const hashPass = bcrypt.hashSync(newPassword, saltRound)

                    user.password = hashPass

                    const updatedUser = await user.save()

                    return resolve({
                        success: true,
                        message: messages["PASSWORD_RESET"],
                        password: newPassword
                    })
                }
            } catch (error) {
                console.error(error, "<<-- Error in forgot password")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"],
                    err: error.message ?? error.toString()
                })
            }
        })
    }
}