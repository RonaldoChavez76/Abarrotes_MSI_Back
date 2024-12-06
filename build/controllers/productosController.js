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
const database_1 = __importDefault(require("../database"));
class ProductosController {
    list(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = yield database_1.default.query('SELECT * FROM productos');
            resp.json(productos);
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO productos set ?', [req.body]);
            resp.json({ message: 'Product Saved' });
        });
    }
    createUs(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO usuarios set ?', [req.body]);
            resp.json({ message: 'El usuario se registro con exito' });
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM productos WHERE id =?', [id]);
            resp.json({ message: 'The product was deleted' });
        });
    }
    listCat(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idC } = req.params;
            const productos = yield database_1.default.query(`
		SELECT * FROM productos WHERE id_categoria = ? 
		`, [idC]);
            resp.json(productos);
        });
    }
    listCatTop(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const productoTop = yield database_1.default.query('SELECT * FROM productos ORDER BY stock ASC LIMIT 6');
            resp.json(productoTop);
        });
    }
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE productos set ? WHERE id = ?', [req.body, id]);
            resp.json({ message: 'The product was updated' });
        });
    }
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productos = yield database_1.default.query('SELECT * FROM productos WHERE id = ?', [id]);
            if (productos.length > 0) {
                return resp.json(productos[0]);
            }
            resp.status(404).json({ text: 'The product does`nt exists' });
        });
    }
}
const productosController = new ProductosController();
exports.default = productosController;
