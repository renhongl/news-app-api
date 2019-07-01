/**
 * News App API entry file
 * @author renhongl
 * @email liangrenhong2017@gmail.com
 */
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('koa-jsonwebtoken').default;
const koaBody = require('koa-body');
const { getUser, updateUser } = require('./api/user');
const { register, login } = require('./api/auth');
const { errorHandle, connectDB } = require('./common/utils');
const { SECRET, DB_URL, STATIC_PATH, TOKEN_KEY, SWAGGER_DOC_JSON, PORT } = require('./settings/constants');
const { fileUpload } = require('./api/file');
const serve = require('koa-static');
const koaSwagger = require('koa2-swagger-ui');
const { getNewsById, getNewsByAuthor, getLatestNewsList, createNews, deleteNews } = require('./api/news');

// Create app and router instance
const app = new Koa();
const router = new Router();

// Connecting db
connectDB(DB_URL);

// Handle common error
app.use(errorHandle);

// Parse request body
app.use(koaBody({ multipart: true }));

// Apply static file server
app.use(serve(STATIC_PATH));

// Apply token validation
app.use(
  jwt({
    secret: SECRET,
    extractToken: (ctx) => {
      return ctx.header.token;
    },
    key: TOKEN_KEY,
  }).unless({
    path: [/\/register/, /\/login/, /\/doc/],
  }),
);

// Router definition
router
  .post('/register', register)
  .post('/login', login)
  .get('/user/:id', getUser)
  .put('/user/:id', updateUser)
  .post('/file/:type', fileUpload)
  .get('/news/:id', getNewsById)
  .get('/news/author/:author', getNewsByAuthor)
  .get('/news/latest/:nums', getLatestNewsList)
  .post('/news', createNews)
  .delete('/news/:id', deleteNews)

// Apply route middleware
app
  .use(router.routes())
  .use(router.allowedMethods());

// Apply swagger middleware
app.use(
  koaSwagger({
    routePrefix: '/doc', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: SWAGGER_DOC_JSON, // example path to json
    },
  }),
);

// Listen to port
app.listen(PORT);

// Print log on console
console.log('Server Running: http://localhost:' + PORT);
console.log('Swagger Running: http://localhost:' + 3000 + '/doc');

