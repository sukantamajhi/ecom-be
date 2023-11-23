const swaggerAutogen = require('swagger-autogen')({ openapi: "3.0.0" })

const doc = {
    info: {
        title: 'Dress Code',
        description: 'Dess code application api documentation'
    },
    servers: [
        {
            url: 'http://localhost:4000/api',
            description: 'Local url'
        },
        {
            url: "https://ecom-be-oeik.onrender.com/api",
            description: "This is server url"
        }
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header', // can be 'header', 'query' or 'cookie'
            name: 'authorization', // name of the header, query parameter or cookie
            description: 'Some description...'
        }
    }
};

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/index.js']

swaggerAutogen(outputFile, endpointsFiles, doc)