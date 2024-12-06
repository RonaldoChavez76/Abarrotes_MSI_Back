"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailController_1 = __importDefault(require("../controllers/emailController"));
class EmailRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/send-confirmation', emailController_1.default.sendPurchaseConfirmation);
    }
}
const emailRoutes = new EmailRoutes();
exports.default = emailRoutes.router;
