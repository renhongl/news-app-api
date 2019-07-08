const User = require('../models/user');
const Mongoose = require('mongoose');

/**
 * @swagger
 * /user/{username}:
 *    get:
 *      tags:
 *        - User
 *      summary: Query user information by username
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: username
 *          description: User name
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
    let user = await User.findOne({username}, { _id: 0, password: 0});
    ctx.status = 200;
    if (user) {
      ctx.body = {
        code: 200,
        message: 'Success',
        data: user,
      };
    } else {
      ctx.body = {
        code: 200,
        message: `No user name: ${username}`,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};

/**
 * @swagger
 * /user/{id}:
 *  put:
 *    tags:
 *      - User
 *    summary: Update user information
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: id
 *         description: User ID
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
    const id = ctx.params.id;
    let currUser = await User.findOne(new Mongoose.Types.ObjectId(id));
    if (currUser) {
      let newUser = request.body;
      if (newUser.password) {
        delete newUser.password;
      }
      if (newUser.username) {
        delete newUser.username;
      }
      let res = await User.updateOne({_id: new Mongoose.Types.ObjectId(id)}, newUser);
      console.log(res);
      if (res.ok) {
        ctx.status = 200;
        ctx.body = {
          code: 200,
          message: 'Success',
          data: newUser,
        };
      }
    } else {
      ctx.body = {
        code: 200,
        message: `No user id ${id} to be update`,
        data: null,
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
