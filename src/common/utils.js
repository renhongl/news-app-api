const mongoose = require('mongoose');

const errorHandle = (ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  });
};

const connectDB = url => {
  if (!url) {
    throw Error('Mongo uri is undefined');
  }

  return mongoose.connect(url).then(mongodb => {
    return mongodb;
  });
};

module.exports = {
  errorHandle,
  connectDB,
};
