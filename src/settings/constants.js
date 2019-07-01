

module.exports = {
  // Secret for create token
  SECRET: 'NEWS_SECRET',
  // Connecting db url
  DB_URL: 'mongodb://localhost/news',
  // Static source path on server
  STATIC_PATH: './static',
  // Token key pass on header
  TOKEN_KEY: 'token',
  // Swagger rendering source file
  SWAGGER_DOC_JSON: '/doc/api.json',
  // Server port
  PORT: 3000,
};
