const userModel = require("../auth/model")
const messages = require("../utils/messages.json")

module.exports = {
    getAllUsers: (req) => {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await userModel.find({ isDeleted: false })
                if (users.length > 0) {
                    return resolve({
                        success: true,
                        message: messages["USERS_FOUND_SUCCESSFUL"],
                        users
                    })
                } else {
                    return resolve({
                        success: true,
                        message: messages["NO_USERS_FOUND"],
                        users: []
                    })
                }
            } catch (error) {
                console.error(error, "<<-- Error in getting all users")
                return reject({
                    success: false,
                    message: messages["INTERNAL_SERVER_ERROR"],
                    err: error.message ?? error.toString()
                })
            }
        })
    }
}