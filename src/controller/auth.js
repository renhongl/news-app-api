const User = require('../models/user');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { SECRET } = require('../settings/constants');
const { send } = require('../common/mail');
const Store = require('../common/store');

const store = new Store();

const generateCode = function(len) {
  const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let ret = '';
  for (let i = 0; i < len; i++) {
    ret += data[Math.floor(Math.random() * 10)];
  }
  return ret;
}

/**
 * @swagger
 * /register/mail:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send a verify mail for register
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: "#definitions/mailSchema"
 *     responses:
 *       200:
 *         description: Success
 */
const verifyMail = async = (ctx) => {
  try {
    const { body } = ctx.request;
    if (!body.mail || !body.username) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'Bad request, User name and mail is required'
      }
      return;
    }
    const code = generateCode(6);
    store.setItem(body.mail, code);
    console.log(code);
    setTimeout(() => {
      store.setItem(body.mail, null);
    }, 1000 * 60 * 30);
    send({
      to: body.mail,
      subject: 'Register New Account',
      html: `Welcome <b>${body.username}</b> to register Ai Kan, <br/>you verify code is: <b style="color: red">${code}</b>, please verify it in 30 minutes`,
    }).then((data) => {
      console.log('Register mail sent');
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: 'Mail sent, please check from your email'
      }
    }).catch(error => {
      console.log(error);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: 'Server error, please try again later'
      }
    });
    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: 'Mail sent, please check from your email'
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
}

/**
 * @swagger
 * /register:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Register a new user
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/registerSchema"
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#definitions/apiResponse"
 */
const register = async ctx => {
  try {
    const { body } = ctx.request;
    if (!body.username || !body.password || !body.code || !body.mail) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: `Bad request, User name, password, mail, verify code is required`,
      };
      return;
    }
    body.password = await bcrypt.hash(body.password, 5);

    let user = await User.find({ username: body.username });

    if (!user.length) {
      console.log(body.code);
      console.log(store.getItem(body.mail));
      if (body.code !== store.getItem(body.mail)) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: 'Verify code is invalid',
        };
        return;
      }
      const newUser = new User(body);
      user = await newUser.save();
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: 'Success',
        data: user,
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

/**
 * @swagger
 * /login:
 *    post:
 *      tags:
 *        - Auth
 *      summary: Login by username and password
 *      produces:
 *        - application/json
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/definitions/loginSchema"
 *      responses:
 *        401:
 *           description: Invalid token
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/definitions/apiResponse"
 *
 */
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
          token: jsonwebtoken.sign(
            {
              data: user,
              exp: Math.floor(Date.now() / 1000) + 60 * 60, // 60 seconds * 60 minutes = 1 hour
            },
            SECRET,
          ),
          user,
        },
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
  verifyMail,
};
