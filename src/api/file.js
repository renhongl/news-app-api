

const fs = require("fs");
const cryptoRandomString = require('crypto-random-string');

const fileUpload = async (ctx) => {
    try {
        const file = ctx.request.files.file;
        const type = ctx.params.type || 'common';
        const reader = fs.createReadStream(file.path);
        const filename = cryptoRandomString({ length: 10, type: 'url-safe' });
        const nameArr = file.name.split(/\./);
        const suffix = nameArr[nameArr.length - 1];
        const imageName = `file-${filename}.${suffix}`;
        let upstream = fs.createWriteStream(`./static/${type}/${imageName}`);
        reader.pipe(upstream);
        ctx.status = 200;
        ctx.body = {
            message: 'Upload successfully',
            imageName,
            type,
        };
    } catch (error) {
        console.log(error);
        ctx.status = 500;
    }
}

module.exports = {
    fileUpload,
}