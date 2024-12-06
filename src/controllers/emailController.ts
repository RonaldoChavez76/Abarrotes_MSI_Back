import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

class EmailController {
    private transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'chavezronaldo675@gmail.com',
            pass: 'wfwu pqzm ofsd nhrt'
        }
    });

    public async sendPurchaseConfirmation(req: Request, res: Response): Promise<void> {
        try {
            const { to, items, total, purchaseDate, ubicacion } = req.body;

            let itemsList = items.map((item: any) => 
                `${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio_unitario}`
            ).join('\n');

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

            await this.transporter.sendMail(mailOptions);
            res.json({ message: 'Correo de confirmación enviado' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ message: 'Error al enviar el correo de confirmación' });
        }
    }
}

const emailController = new EmailController();
export default emailController;