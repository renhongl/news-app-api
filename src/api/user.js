

const User = require('../models/user');



/**
 * @swagger
 * /user/{username}:
 *    get:
 *      description: description
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: username
 *          in: path
 *          description: User name
 *          required: true
 *          schema:
 *             type: string
 *        - name: token
 *          in: header
 *          description: Token for call api
 *          required: true
 *          schema:
 *             type: string
 *      responses:
 *        401:
 *           description: Invalid token 
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  message:
 *                    type: string
 *                  data:
 *                    type: object
 *         
 */
const getUser = async (ctx, next) => {
  try {
    const username = ctx.params.username;
    let user = await User.findOne({ username: username });
    ctx.status = 200;
    if (user) {
      ctx.body = {
        code: 200,
        message: 'Success',
        data: user
      };
    } else {
      ctx.body = {
        code: 200,
        message: `No user named: ${username}`,
        data: null
      };
    }
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};



const updateUser = async (ctx, next) => {
  try {
    const request = ctx.request;
    ctx.status = 200;
    const username = ctx.params.username;
    let currUser = await User.findOne({ username });
    if (currUser) {
      let newUser = request.body;
      if (newUser.password) {
        delete newUser.password;
      }
      let res = await User.updateOne({ username }, newUser, { omitUndefined: true });
      if (res.ok) {
        ctx.body = {
          code: 200,
          data: newUser
        };
      }
    } else {
      ctx.body = {
        code: 200,
        message: `No user named: ${username} to be update`,
        data: null
      };
    }
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};


module.exports = {
  getUser,
  updateUser,
};
