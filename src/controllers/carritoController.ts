import { Request, Response } from 'express';
import pool from '../database';

class CarritoController {

    public async create(req: Request, resp: Response): Promise<void> {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
    
        try {
            const { items, id_usuario, latitud, longitud } = req.body;
    
            if (!items || items.length === 0) {
                throw new Error('No items provided');
            }

            if (!latitud || !longitud){
                throw new Error('Sin datos de locacion');
            }
    
            // Crear la venta con el id del usuario
            const result = await connection.query('INSERT INTO venta (id_usuario) VALUES (?)', [id_usuario]);
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
                await connection.query('INSERT INTO detalle_venta SET ?', newDetail);
    
                // Actualizar el stock del producto
                await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [item.cantidad, item.id]);
            }
    
            await connection.commit();
            resp.json({ message: 'Venta creada exitosamente y stock actualizado' });
        } catch (error) {
            await connection.rollback();
            resp.status(500).json({ message: 'Error al crear la venta', error });
        } finally {
            connection.release();
        }
    }
    


    public async listVentasByUsuario(req: Request, resp: Response): Promise<void> {
        const { id_usuario } = req.params;
        const ventas = await pool.query(`
            SELECT v.id, v.fecha, v.id_usuario, 
            SUM(dv.total) AS totalVenta
            FROM venta v
            JOIN detalle_venta dv ON v.id = dv.id_venta
            WHERE v.id_usuario = ?
            GROUP BY v.id
        `, [id_usuario]);
        
        for (const venta of ventas) {
            venta.detalles = await pool.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
        }
        
        resp.json({ ventas });
    }
    
    
    
    public async listAllVentas(req: Request, resp: Response): Promise<void> {
        const ventas = await pool.query(`
            SELECT v.id, v.fecha, v.id_usuario, 
            SUM(dv.total) AS totalVenta
            FROM venta v
            JOIN detalle_venta dv ON v.id = dv.id_venta
            GROUP BY v.id
            ORDER BY v.fecha DESC
            LIMIT 15
        `);
        
        for (const venta of ventas) {
            venta.detalles = await pool.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
        }
        
        resp.json(ventas);
    }
    
    
    public async getVentaById(req: Request, resp: Response): Promise<void> {
        const { id } = req.params;
        const ventas = await pool.query(`
            SELECT v.id, v.fecha, v.id_usuario, 
            SUM(dv.total) AS totalVenta
            FROM venta v
            JOIN detalle_venta dv ON v.id = dv.id_venta
            WHERE v.id = ?
            GROUP BY v.id
        `, [id]);
        
        if (ventas.length > 0) {
            const venta = ventas[0];
            venta.detalles = await pool.query('SELECT * FROM detalle_venta WHERE id_venta = ?', [venta.id]);
            resp.json(venta);
        } else {
            resp.status(404).json({ message: 'Venta no encontrada' });
        }
    }
    
    
}

const carritoController = new CarritoController();
export default carritoController;
