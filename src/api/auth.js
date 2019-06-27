const User = require('../models/user');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../settings/constants');

const register = async ctx => {
  const { body } = ctx.request;
  try {
    if (!body.username || !body.password) {
      ctx.status = 400;
      ctx.body = {
        error: `expected an object with username, password but got: ${body}`,
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
        message: 'Success',
        user,
      };
    } else {
      ctx.status = 406;
      ctx.body = {
        message: 'User name existed',
      };
    }
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};

const login = async ctx => {
  const { body } = ctx.request;
  try {
    const user = await User.findOne({ username: body.username });
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        message: 'User name error',
      };
      return;
    }
    // 匹配密码是否相等
    if (await bcrypt.compare(body.password, user.password)) {
      ctx.status = 200;
      ctx.body = {
        message: 'Login Successfully',
        user: user.userInfo,
        // 生成 token 返回给客户端
        token: jsonwebtoken.sign(
          {
            data: user,
            // 设置 token 过期时间
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 60 seconds * 60 minutes = 1 hour
          },
          SECRET,
        ),
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        message: 'Password error',
      };
    }
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};

module.exports = {
  register,
  login,
};
