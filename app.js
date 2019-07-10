/**
 * News App API entry file
 * @author renhongl
 * @email liangrenhong2017@gmail.com
 */
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('koa-jsonwebtoken').default;
const koaBody = require('koa-body');
const { getUser, updateUser } = require('./src/controller/user');
const { register, login, verifyMail } = require('./src/controller/auth');
const { connectDB } = require('./src/common/db');
const { errorHandle } = require('./src/common/errorHandle');
const {
  SECRET,
  DB_URL,
  STATIC_PATH,
  TOKEN_KEY,
  SWAGGER_DOC_JSON,
  PORT,
} = require('./src/settings/constants');
const { fileUpload } = require('./src/controller/file');
const serve = require('koa-static');
const koaSwagger = require('koa2-swagger-ui');
const {
  getNewsById,
  getNewsByAuthor,
  getLatestNewsList,
  createNews,
  deleteNews,
} = require('./src/controller/news');
const cors = require('@koa/cors');

// Create app and router instance
const app = new Koa();
const router = new Router();

const corsOptions = {
  origin: '*'
}

// Connecting db
connectDB(DB_URL);

app.use(cors(corsOptions));

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
    extractToken: ctx => {
      return ctx.header.token;
    },
    key: TOKEN_KEY,
  }).unless({
    path: [/\/register/, /\/login/, /\/doc/, /\/mail/, /\/news/, /\/file/, /\/user/],
  }),
);

// Router definition
router
  .post('/register', register)
  .post('/register/mail/', verifyMail)
  .post('/login', login)
  .get('/user/:username', getUser)
  .put('/user/:id', updateUser)
  .post('/file/:type', fileUpload)
  .get('/news/:id', getNewsById)
  .get('/news/author/:author', getNewsByAuthor)
  .get('/news/latest/:type', getLatestNewsList)
  .post('/news', createNews)
  .delete('/news/:id', deleteNews);
  


// Apply route middleware
app.use(router.routes()).use(router.allowedMethods());

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
