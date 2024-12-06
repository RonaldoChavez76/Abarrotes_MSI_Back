"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carritoController_1 = __importDefault(require("../controllers/carritoController"));
class CarritoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/crear/', carritoController_1.default.create);
        this.router.get('/ventas-us/:id_usuario', carritoController_1.default.listVentasByUsuario);
        this.router.get('/ventas', carritoController_1.default.listAllVentas);
        this.router.get('/ventas/:id', carritoController_1.default.getVentaById);
    }
}
const carritoRoutes = new CarritoRoutes;
exports.default = carritoRoutes.router;
