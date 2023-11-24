const pino = require("pino")
const config = require("../src/config")

const logger = pino({
    level: config.logLevel,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})

module.exports = logger