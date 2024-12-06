import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

// Endpoint para enviar correos
router.post('/send-email', async (req, res) => {
  const { email, pedido, total } = req.body;

  // Configuración del transportador de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // O usa un servicio SMTP como Mailtrap u Outlook
    auth: {
      user: 'chavezronaldo675@gmail.com',
      pass: 'wfwu pqzm ofsd nhrt',
    },
  });

  // Contenido del correo
  const mailOptions = {
    from: 'chavezronaldo675@gmail.com',
    to: email,
    subject: 'Confirmación de Pedido',
    html: `
      <h1>¡Gracias por tu compra!</h1>
      <p>Hemos recibido tu pedido con éxito.</p>
      <h3>Detalles del Pedido:</h3>
      <ul>
        ${pedido
          .map(
            (item: any) =>
              `<li>${item.cantidad} x ${item.nombre} - $${item.precio_unitario}</li>`
          )
          .join('')}
      </ul>
      <h3>Total: $${total}</h3>
      <p>Esperamos verte pronto de nuevo.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado con éxito.' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar correo.', error });
  }
});

export default router;
