const User = require('../models/user');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../settings/constants');

const register = async ctx => {
  try {
    const { body } = ctx.request;
    if (!body.username || !body.password) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: `Bad request`,
      };
      return;
    }
    body.password = await bcrypt.hash(body.password, 5);

    let user = await User.find({ username: body.username });

    if (!user.length) {
      const newUser = new User(body);
      user = await newUser.save();
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: 'Success',
        data: user
      };
    } else {
      ctx.status = 406;
      ctx.body = {
        code: 406,
        message: 'User name existed',
      };
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
};

const login = async ctx => {
  try {
    const { body } = ctx.request;
    const user = await User.findOne({ username: body.username });
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: 'User name error',
      };
      return;
    }
    if (await bcrypt.compare(body.password, user.password)) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: 'Login successfully',
        data: {
          token: jsonwebtoken.sign({
            data: user,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 60 seconds * 60 minutes = 1 hour
          },
            SECRET,
          ),
        }
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: 'Password error',
      };
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
};

module.exports = {
  register,
  login,
};
