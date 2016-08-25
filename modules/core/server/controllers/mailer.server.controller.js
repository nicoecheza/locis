'use strict';

var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'locis.services@gmail.com',
        pass: 'locis123456'
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

// send mail with defined transport object
exports.sendMail = function (req, res, next) {

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: '"Locis Services" <locis.services@gmail.com>', // sender address
      to: req.query.to, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world 🐴', // plaintext body
      html: '<b>Hello world 🐴</b>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent to: ' + JSON.stringify(mailOptions.to));
      res.redirect('/');
  });
}
