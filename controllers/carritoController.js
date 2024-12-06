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
            const connection = yield database_1.default.getConnection(); // Obtener conexión
            yield connection.beginTransaction(); // Iniciar transacción
    
            try {
                const { items, id_usuario, latitud, longitud } = req.body;
    
                // Validaciones iniciales
                if (!items || items.length === 0) {
                    throw new Error('No items provided');
                }
                if (!latitud || !longitud) {
                    throw new Error('Sin datos de locación');
                }
    
                // Crear la venta con el id del usuario
                const [ventaResult] = yield connection.query(
                    'INSERT INTO venta (id_usuario) VALUES (?)',
                    [id_usuario]
                );
                const id_venta = ventaResult.insertId; // Obtener el id de la venta creada
    
                // Iterar sobre los items para crear el detalle de venta y actualizar el stock
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
                        latitud: latitud, // Agregar la ubicación
                        longitud: longitud,
                    };
    
                    // Insertar el detalle de la venta
                    yield connection.query('INSERT INTO detalle_venta SET ?', [newDetail]);
    
                    // Actualizar el stock del producto
                    yield connection.query(
                        'UPDATE productos SET stock = stock - ? WHERE id = ?',
                        [item.cantidad, item.id]
                    );
                }
    
                yield connection.commit(); // Confirmar transacción
                resp.json({ message: 'Venta creada exitosamente y stock actualizado' });
            } catch (error) {
                yield connection.rollback(); // Revertir cambios en caso de error
                resp.status(500).json({ message: 'Error al crear la venta', error: error.message });
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    listVentasByUsuario(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params;
    
            try {
                // Obtener las ventas con el total de la venta por usuario
                const [ventas] = yield database_1.default.query(`
                    SELECT v.id, v.fecha, v.id_usuario, 
                    SUM(dv.total) AS totalVenta
                    FROM venta v
                    JOIN detalle_venta dv ON v.id = dv.id_venta
                    WHERE v.id_usuario = ?
                    GROUP BY v.id
                `, [id_usuario]);
    
                // Obtener los detalles de cada venta
                for (const venta of ventas) {
                    const [detalles] = yield database_1.default.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
                    venta.detalles = detalles; // Asignar detalles a cada venta
                }
    
                // Responder con las ventas y sus detalles
                resp.json({ ventas });
            } catch (error) {
                resp.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
            }
        });
    }
    
    listAllVentas(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener las ventas con el total de la venta
                const [ventas] = yield database_1.default.query(`
                    SELECT v.id, v.fecha, v.id_usuario, 
                    SUM(dv.total) AS totalVenta
                    FROM venta v
                    JOIN detalle_venta dv ON v.id = dv.id_venta
                    GROUP BY v.id
                    ORDER BY v.fecha DESC
                    LIMIT 15
                `);
    
                // Obtener los detalles de cada venta
                for (const venta of ventas) {
                    const [detalles] = yield database_1.default.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
                    venta.detalles = detalles; // Asignar detalles a cada venta
                }
    
                // Responder con las ventas y sus detalles
                resp.json(ventas);
            } catch (error) {
                resp.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
            }
        });
    }
    
    getVentaById(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // Obtener la venta con su total
                const [ventas] = yield database_1.default.query(`
                    SELECT v.id, v.fecha, v.id_usuario, 
                    SUM(dv.total) AS totalVenta
                    FROM venta v
                    JOIN detalle_venta dv ON v.id = dv.id_venta
                    WHERE v.id = ?
                    GROUP BY v.id
                `, [id]);
    
                if (ventas.length > 0) {
                    const venta = ventas[0];
    
                    // Obtener los detalles de la venta
                    const [detalles] = yield database_1.default.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
                    venta.detalles = detalles; // Asignar detalles a la venta
    
                    // Responder con la venta y sus detalles
                    resp.json(venta);
                } else {
                    resp.status(404).json({ message: 'Venta no encontrada' });
                }
            } catch (error) {
                resp.status(500).json({ message: 'Error al obtener la venta', error: error.message });
            }
        });
    }
    
}
const carritoController = new CarritoController();
exports.default = carritoController;
