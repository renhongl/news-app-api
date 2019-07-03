
const Mongoose = require('mongoose');
const connectDB = url => {
    if (!url) {
        throw Error('Mongo uri is undefined');
    }

    return Mongoose.connect(url, { useNewUrlParser: true }).then(mongodb => {
        return mongodb;
    });
};


module.exports = {
    connectDB
}