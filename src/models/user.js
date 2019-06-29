const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const User = mongoose.model('User', userSchema);

module.exports = User;
