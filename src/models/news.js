const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const newsSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Number,
    required: true,
  },
  comment: Number,
  content: {
    type: String,
    required: true,
  },
  previewImg: String
});

const News = Mongoose.model('News', newsSchema);

module.exports = News;
