

const User = require('../models/user');


const getUser = async (ctx, next) => {
  const request = ctx.request;
  try {
    const username = request.query.username;
    let user = await User.findOne({ username: username });
    ctx.status = 200;
    if (user) {
      ctx.body = user;
    } else {
      ctx.body = {
        message: `No user named: ${username}`,
      };
    }
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};



const updateUser = async (ctx, next) => {
  const request = ctx.request;
  try {
    ctx.status = 200;
    const username = request.query.username;
    let currUser = await User.findOne({ username });
    if (currUser) {
      let newUser = request.body;
      let res = await User.updateOne({ username }, newUser, { upsert: true });
      if (res.ok) {
        ctx.body = newUser;
      }
    } else {
      ctx.body = {
        message: `No user named: ${username} to be update`,
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
