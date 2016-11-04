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
      from: '"Locis Services" <locis.services@gmail.com>',
      to: req.body.to,
      subject: 'Bienvenido ' + req.body.name,
      text: 'Bienvenido ' + req.body.name,
      html: '<b>Gracias por formar parte de nuestra empresa.</b><br /> Por favor sea amable de facilitarnos los siguientes datos para que podamos proceder con la constitución del estatuto por usted requerido.<br /><ul><li>Nombre de la sociedad.</li><li>Cantidad de socios</li><li>Nombre de los socios</li><li>Nacionalidad</li><li>Estado Civil</li><li>Nombre de los padres</li><li>Nombre del cónyuge</li><li>Número de DNI o Pasaporte</li><li>Domicilio (direccion completa y provincia)</li><li>Objeto de la sociedad</li><li>Capital social</li><li>Cantidad de acciones y valor de las mismas</li><li>Nombre del Director titular</li><li>Nombre del Director suplente</li><li>Participación de los socios</li><br /><b>Sin más quedamos a la espera de la información.<br /> Muchas gracias.'
  };

  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent to: ' + JSON.stringify(mailOptions.to));
      res.redirect('/');
  });
}
