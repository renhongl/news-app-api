/**
 * News App API enter file
 * Connect db
 * Define routes
 * Run token verify
 */

const Koa = require('koa');
const route = require('koa-route');
const jwt = require('koa-jsonwebtoken').default;
const koaBody = require('koa-body');
const { getUser, updateUser } = require('./api/user');
const { register, login } = require('./api/auth');
const { errorHandle, connectDB } = require('./common/utils');
const { SECRET } = require('./settings/constants');
const { fileUpload } = require('./api/common');
const serve = require('koa-static');

const app = new Koa();

connectDB('mongodb://localhost/news');

app.use(errorHandle);
app.use(koaBody({ multipart: true }));
app.use(serve('./upload'));

app.use(route.post('/register', register));
app.use(route.post('/login', login));

app.use(
  jwt({
    secret: SECRET,
    extractToken: (ctx) => {
        return ctx.header.token;
    },
    key: 'token',
  }).unless({
    path: [/\/register/, /\/login/],
  }),
);

// Get user information from username
app.use(route.get('/user', getUser));

// Update user infor
app.use(route.put('/user', updateUser));

// File upload for user header image
app.use(route.post('/fileUpload', fileUpload))


app.listen(3000);
console.log('Server Running: 3000');
