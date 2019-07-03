const nodemailer = require("nodemailer");

const { SERVER_MAIL, PASS } = require('../settings/constants');

// async..await is not allowed in global scope, must use a wrapper
async function send({from, to, text, subject, html}){

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: SERVER_MAIL, // generated ethereal user
      pass: PASS // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: from || 'liang_renhong@163.com', // sender address
    to: to || "1075220132@qq.com", // list of receivers
    subject: subject || "Hello ✔", // Subject line
    // text: text || "Hello world?", // plain text body
    html: html || "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = {
    send,
}