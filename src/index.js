

const Koa = require('koa');
const route = require('koa-route');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();

const { getUser, createUser, updateUser, deleteUser } = require('./user');





app.use(route.get('/user', getUser));
app.use(route.post('/user', createUser));
app.use(route.put('/user', updateUser));
app.use(route.delete('/user', deleteUser));


//app.use(serve(path.join(__dirname)));

// app.on('error', (ctx, error) => {
//   console.log(error);
// });

app.listen(3000);
console.log('Server Running: 3000');