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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailController {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: 'chavezronaldo675@gmail.com',
                pass: 'wfwu pqzm ofsd nhrt'
            }
        });
    }
    sendPurchaseConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { to, items, total, purchaseDate, ubicacion } = req.body;
                let itemsList = items.map((item) => `${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio_unitario}`).join('\n');
                const mailOptions = {
                    from: 'chavezronaldo675@gmail.com',
                    to: to,
                    subject: 'Confirmación de Compra',
                    text: `
                    ¡Gracias por tu compra!
                    
                    Detalles de tu pedido:
                    
                    ${itemsList}
                    
                    Total: $${total}
                    Fecha: ${new Date(purchaseDate).toLocaleString()}
                    
                    Ubicación de entrega:
                    Latitud: ${ubicacion.latitud}
                    Longitud: ${ubicacion.longitud}
                    
                    Tu pedido será procesado y enviado a la ubicación seleccionada.
                    ¡Gracias por tu preferencia!
                `
                };
                yield this.transporter.sendMail(mailOptions);
                res.json({ message: 'Correo de confirmación enviado' });
            }
            catch (error) {
                console.error('Error al enviar el correo:', error);
                res.status(500).json({ message: 'Error al enviar el correo de confirmación' });
            }
        });
    }
}
const emailController = new EmailController();
exports.default = emailController;
