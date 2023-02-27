const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config()

const options = {
apis: ["./swagger/*.js"],
definition: {
    openapi: "3.0.0",
    info: {
    title: "Documentation for my-brand API",
    version: "1.0.0",
    description: "An API for my personal brand website",
    },
    servers: [
    {
        url: process.env.SERVER_URI,
    },
    ],
    components: {
    securitySchemes: {
        bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "x-access-token"
          },
        bodyAuth: {
            type: "apiKey",
            in: "body",
            name: "token"
        }
    },
    },
},
};
const specs = swaggerJSDoc(options);

module.exports = specs