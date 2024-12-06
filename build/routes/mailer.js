"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
// Endpoint para enviar correos
router.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pedido, total } = req.body;
    // Configuración del transportador de Nodemailer
    const transporter = nodemailer_1.default.createTransport({
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
            .map((item) => `<li>${item.cantidad} x ${item.nombre} - $${item.precio_unitario}</li>`)
            .join('')}
      </ul>
      <h3>Total: $${total}</h3>
      <p>Esperamos verte pronto de nuevo.</p>
    `,
    };
    try {
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado con éxito.' });
    }
    catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ message: 'Error al enviar correo.', error });
    }
}));
exports.default = router;
