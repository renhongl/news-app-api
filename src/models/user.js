const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  avator: String,
  intro: String,
  gender: String,
  birthday: Number,
  place: String,
  news: Number,
  follower: Number,
  followee: Number,
  love: Number
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
