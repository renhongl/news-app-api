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
                    type: 'integer',
                    example: 200
                },
                message: {
                    type: 'string',
                    example: 'Success'
                },
                data: {
                    type: 'object'
                }
            }
        },
        user: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    example: 'lrh'
                },
                avator: {
                    type: 'string',
                    example: '/avator/avator.png'
                },
                intro: {
                    type: 'string',
                    example: 'Today is a good day'
                },
                gender: {
                    type: 'string',
                    example: 'male'
                },
                birthday: {
                    type: 'integer',
                    example: 12144534
                },
                place: {
                    type: 'string',
                    example: 'SingaporeA/ng Mo Kio'
                },
                news: {
                    type: 'integer',
                    example: 32
                },
                follower: {
                    type: 'integer',
                    example: 65
                },
                followee: {
                    type: 'integer',
                    example: 92
                },
                love: {
                    type: 'integer',
                    example: 23
                }
            }
        }
    },
    apis: ['./src/api/*.js'],
};