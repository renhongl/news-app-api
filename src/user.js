
const commonSettings = (ctx) => {
  ctx.response.type = 'json';
}


const getUser = async (ctx, next) => {
  commonSettings(ctx);
  ctx.response.body = {"name": "Sun Wu Kong", "age": 1000};
}

const createUser = (ctx, next) => {
  commonSettings(ctx);
  ctx.response.body = {"name": "Sun Wu Kong", "age": 460};
}

const updateUser = (ctx, next) => {
  commonSettings(ctx);
  ctx.response.body = {"name": "Sun Wu Kong", "age": 599};
}

const deleteUser = (ctx, next) => {
  commonSettings(ctx);
  ctx.response.body = {"name": "Sun Wu Kong", "age": 670};
}


module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
