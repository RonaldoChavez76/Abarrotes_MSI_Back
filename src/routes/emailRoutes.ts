import { Router } from "express";
import emailController from "../controllers/emailController";

class EmailRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post('/send-confirmation', emailController.sendPurchaseConfirmation);
    }
}

const emailRoutes = new EmailRoutes();
export default emailRoutes.router;