module.exports = {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
        title: 'Hello World', // Title (required)
        version: '1.0.0', // Version (required)
    },
    securityDefinitions: {
        auth: {
            type: 'basic'
        }
    },
    security: [
        { token: [] }
    ],
    // Path to the API docs
    apis: ['./src/api/user.js'],
};