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
class CarritoController {
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield database_1.default.getConnection();
            yield connection.beginTransaction();
            try {
                const { items, id_usuario, latitud, longitud } = req.body;
                if (!items || items.length === 0) {
                    throw new Error('No items provided');
                }
                if (!latitud || !longitud) {
                    throw new Error('Sin datos de locacion');
                }
                // Crear la venta con el id del usuario
                const result = yield connection.query('INSERT INTO venta (id_usuario) VALUES (?)', [id_usuario]);
                const id_venta = result.insertId;
                for (const item of items) {
                    if (!item.id || !item.nombre || !item.cantidad || !item.precio_unitario) {
                        throw new Error('Invalid item data');
                    }
                    const newDetail = {
                        id_venta: id_venta,
                        id_producto: item.id,
                        nombre_producto: item.nombre,
                        cantidad: item.cantidad,
                        total: item.precio_unitario * item.cantidad,
                        latitud: latitud, //se agrego la parte de la ubicacion 
                        longitud: longitud
                    };
                    // Insertar el detalle de la venta
                    yield connection.query('INSERT INTO detalle_venta SET ?', newDetail);
                    // Actualizar el stock del producto
                    yield connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [item.cantidad, item.id]);
                }
                yield connection.commit();
                resp.json({ message: 'Venta creada exitosamente y stock actualizado' });
            }
            catch (error) {
                yield connection.rollback();
                resp.status(500).json({ message: 'Error al crear la venta', error });
            }
            finally {
                connection.release();
            }
        });
    }
    listVentasByUsuario(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
            const ventas = yield database_1.default.query(`
            SELECT v.id, v.fecha, v.id_usuario, 
            SUM(dv.total) AS totalVenta
            FROM venta v
            JOIN detalle_venta dv ON v.id = dv.id_venta
            WHERE v.id_usuario = ?
            GROUP BY v.id
        `, [id_usuario]);
            for (const venta of ventas) {
                venta.detalles = yield database_1.default.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
            }
            resp.json({ ventas });
        });
    }
    listAllVentas(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const ventas = yield database_1.default.query(`
            SELECT v.id, v.fecha, v.id_usuario, 
            SUM(dv.total) AS totalVenta
            FROM venta v
            JOIN detalle_venta dv ON v.id = dv.id_venta
            GROUP BY v.id
            ORDER BY v.fecha DESC
            LIMIT 15
        `);
            for (const venta of ventas) {
                venta.detalles = yield database_1.default.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
            }
            resp.json(ventas);
        });
    }
    getVentaById(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const ventas = yield database_1.default.query(`
            SELECT v.id, v.fecha, v.id_usuario, 
            SUM(dv.total) AS totalVenta
            FROM venta v
            JOIN detalle_venta dv ON v.id = dv.id_venta
            WHERE v.id = ?
            GROUP BY v.id
        `, [id]);
            if (ventas.length > 0) {
                const venta = ventas[0];
                venta.detalles = yield database_1.default.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
                resp.json(venta);
            }
            else {
                resp.status(404).json({ message: 'Venta no encontrada' });
            }
        });
    }
}
const carritoController = new CarritoController();
exports.default = carritoController;
