module.exports = {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
        title: 'News APP API', // Title (required)
        version: '1.0.0', // Version (required)
    },
    components: {
        securitySchemes: {
            Bearer: {
                type: 'apiKey',
                name: 'token',
                in: 'header'
            }
        }
    },
    security: [{
        Bearer: []
    }],
    definitions: {
        loginSchema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    example: 'lrh'
                },
                password: {
                    type: 'string',
                    example: '112233'
                }
            }
        },
        apiResponse: {
            type: 'object',
            properties: {
                code: {
                    type: 'integer'
                }
            }
        }
    },
    apis: ['./src/api/*.js'],
};