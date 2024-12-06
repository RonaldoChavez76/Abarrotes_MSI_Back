const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'chavezronaldo675@gmail.com',
    pass: 'wfwu pqzm ofsd nhrt',
  },
});

const mailOptions = {
  from: 'chavezronaldo675@gmail.com',
  to: 'carlosbrv251023@gmail.com',
  subject: 'Correo de prueba',
  text: 'Este es un correo de prueba enviado usando Nodemailer.',
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log('Error al enviar el correo:', error);
  } else {
    console.log('Correo enviado:', info.response);
  }
});
