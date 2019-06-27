

const fs = require("fs");
const cryptoRandomString = require('crypto-random-string');

const fileUpload = async (ctx) => {
    const file = ctx.request.files.file;
    const type = ctx.request.query.type || 'common';
    const reader = fs.createReadStream(file.path);
    const filename = cryptoRandomString({length: 10, type: 'url-safe'});
    const nameArr = file.name.split(/\./);
    const suffix = nameArr[nameArr.length-1];
    const imageName = `file-${filename}.${suffix}`;
    let upstream = fs.createWriteStream(`./upload/${type}/${imageName}`);
    reader.pipe(upstream);
    ctx.body = {
        message: 'Upload successfully',
        imageName,
        type,
    };
}

module.exports = {
    fileUpload,
}