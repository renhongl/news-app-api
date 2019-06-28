/**
 * News App API enter file
 * Connect db
 * Define routes
 * Run token verify
 */

const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('koa-jsonwebtoken').default;
const koaBody = require('koa-body');
const { getUser, updateUser } = require('./api/user');
const { register, login } = require('./api/auth');
const { errorHandle, connectDB } = require('./common/utils');
const { SECRET } = require('./settings/constants');
const { fileUpload } = require('./api/file');
const serve = require('koa-static');
const koaSwagger = require('koa2-swagger-ui');


const app = new Koa();
const router = new Router();



connectDB('mongodb://localhost/news');

app.use(errorHandle);
app.use(koaBody({ multipart: true }));
app.use(serve('./static'));

app.use(
  jwt({
    secret: SECRET,
    extractToken: (ctx) => {
      return ctx.header.token;
    },
    key: 'token',
  }).unless({
    path: [/\/register/, /\/login/, /\/doc/],
  }),
);


router
  .post('/register', register)
  .post('/login', login)
  .get('/user/:username', getUser)
  .put('/user/:username', updateUser)
  .post('/file/:type', fileUpload);



app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(
  koaSwagger({
    routePrefix: '/doc', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: '/doc/api.json', // example path to json
    },
  }),
);

app.listen(3000);
console.log('Server Running: 3000');
