const mongoose = require('mongoose');

const errorHandle = (ctx, next) => {
  return next().catch(err => {
    if (err.status === 400) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'Bad Request'
      };
      return;
    }
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: 'Invalid Token'
      };
      return;
    }
    if (err.status === 406) {
      ctx.status = 406;
      ctx.body = {
        code: 406,
        message: 'User name existed'
      };
      return;
    }
    if (err.status === 500) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: 'Server error'
      };
      return;
    }
  });
};

const connectDB = url => {
  if (!url) {
    throw Error('Mongo uri is undefined');
  }

  return mongoose.connect(url, { useNewUrlParser: true }).then(mongodb => {
    return mongodb;
  });
};


module.exports = {
  errorHandle,
  connectDB,
};
