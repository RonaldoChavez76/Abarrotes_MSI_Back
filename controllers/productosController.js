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
            try {
                // Obtener la lista de productos
                const [productos] = yield database_1.default.query('SELECT * FROM productos');
                resp.json(productos); // Devolver los productos en la respuesta
            } catch (error) {
                resp.status(500).json({ message: 'Error al obtener los productos', error: error.message });
            }
        });
    }
    
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield database_1.default.getConnection(); // Obtener conexión
            try {
                console.log(req.body); // Imprimir datos del cuerpo de la solicitud para depuración
                const [result] = yield connection.query('INSERT INTO productos SET ?', [req.body]); // Insertar el producto
                resp.json({ message: 'Product Saved', id: result.insertId }); // Retornar el ID del nuevo producto insertado
            } catch (error) {
                resp.status(500).json({ message: 'Error al guardar el producto', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    createUs(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield database_1.default.getConnection(); // Obtener conexión
            try {
                console.log(req.body); // Imprimir datos del cuerpo de la solicitud para depuración
                const [result] = yield connection.query('INSERT INTO usuarios SET ?', [req.body]); // Insertar el usuario
                resp.json({ message: 'El usuario se registró con éxito', id: result.insertId }); // Retornar el ID del nuevo usuario insertado
            } catch (error) {
                resp.status(500).json({ message: 'Error al registrar el usuario', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                const [result] = yield connection.query('DELETE FROM productos WHERE id = ?', [id]); // Ejecutar la consulta de eliminación
                if (result.affectedRows > 0) {
                    resp.json({ message: 'El producto fue eliminado' }); // Si se elimina el producto, retornar un mensaje de éxito
                } else {
                    resp.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra el producto
                }
            } catch (error) {
                resp.status(500).json({ message: 'Error al eliminar el producto', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    listCat(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idC } = req.params;
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                const [productos] = yield connection.query('SELECT * FROM productos WHERE id_categoria = ?', [idC]); // Ejecutar la consulta
                resp.json(productos); // Devolver los productos encontrados
            } catch (error) {
                resp.status(500).json({ message: 'Error al obtener productos por categoría', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    listCatTop(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                const [productoTop] = yield connection.query('SELECT * FROM productos ORDER BY stock ASC LIMIT 6'); // Ejecutar la consulta
                if (productoTop.length > 0) {
                    resp.json(productoTop); // Devolver los productos encontrados
                } else {
                    resp.status(404).json({ message: 'No products found' }); // Si no hay productos
                }
            } catch (error) {
                console.error(error); // Mostrar el error en consola para depuración
                resp.status(500).json({ message: 'Error al obtener los productos más vendidos', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                const [result] = yield connection.query('UPDATE productos SET ? WHERE id = ?', [req.body, id]); // Ejecutar la consulta
                if (result.affectedRows > 0) { // Verificar si se actualizó algún registro
                    resp.json({ message: 'The product was updated' });
                } else {
                    resp.status(404).json({ message: 'Product not found' });
                }
            } catch (error) {
                resp.status(500).json({ message: 'Error updating the product', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                const [productos] = yield connection.query('SELECT * FROM productos WHERE id = ?', [id]); // Ejecutar la consulta
                if (productos.length > 0) {
                    return resp.json(productos[0]); // Devolver el primer producto encontrado
                }
                resp.status(404).json({ text: 'The product doesn\'t exist' }); // Si no se encuentra el producto
            } catch (error) {
                resp.status(500).json({ message: 'Error retrieving the product', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
}
const productosController = new ProductosController();
exports.default = productosController;
