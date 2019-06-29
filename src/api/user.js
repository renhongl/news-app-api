

const User = require('../models/user');



/**
 * @swagger
 * /user/{username}:
 *    get:
 *      tags:
 *        - User
 *      description: Query user information by username
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: username
 *          description: User Name
 *          in: path
 *          required: true
 *          schema:
 *             type: string
 *      responses:
 *        401:
 *           description: Invalid token 
 *        200:
 *          description: Success
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


/**
 * @swagger
 * /user/{username}:
 *  put:
 *    tags:
 *      - User
 *    description: Update user information
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: username
 *         description: User name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/user"
 *    responses:
 *      401:
 *        description: Invalid token
 *      200:
 *        description: Success
 *        content:
 *            application/json:
 *              schema:
 *                $ref: "#definitions/apiResponse"
 *        
 */
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
          message: 'Success',
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
