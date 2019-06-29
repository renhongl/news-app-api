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
    
    apis: ['./src/api/*.js'],
};