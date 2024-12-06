"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuariosController_1 = __importDefault(require("../controllers/usuariosController"));
class UsuariosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', usuariosController_1.default.list);
        this.router.post('/', usuariosController_1.default.createUs);
        this.router.delete('/:id', usuariosController_1.default.delete);
        this.router.put('/:id', usuariosController_1.default.update);
        this.router.post('/login', usuariosController_1.default.login); // Nueva ruta para login
        this.router.get('/:id', usuariosController_1.default.getOne);
        // Agrega esta línea en la configuración de rutas
        this.router.get('/tipo_usuario/:id', usuariosController_1.default.getByTipoUsuario);
    }
}
const usuariosRoutes = new UsuariosRoutes;
exports.default = usuariosRoutes.router;
