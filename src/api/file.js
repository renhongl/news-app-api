

const fs = require("fs");
const cryptoRandomString = require('crypto-random-string');

/**
 * @swagger
 * /file/{type}:
 *  post:
 *      tags:
 *          - File
 *      description: Upload file to server
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: type
 *            description: File type for upload
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *              example: avator or common
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          file:
 *                              type: string
 *                              format: binary
 *      responses:
 *        401:
 *           description: Invalid token 
 *        200:
 *          description: Success
 */
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