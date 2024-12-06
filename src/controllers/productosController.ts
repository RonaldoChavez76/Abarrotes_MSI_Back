import {Request, Response} from 'express';
import pool from '../database';

class ProductosController{

	
public async list(req : Request, resp : Response){
		const productos = await pool.query('SELECT * FROM productos');
		resp.json(productos);
}

public async create(req: Request, resp: Response): Promise<void>{
	console.log(req.body);
	await pool.query('INSERT INTO productos set ?', [req.body]);
	resp.json({message : 'Product Saved'});
}

public async createUs(req: Request, resp: Response): Promise<void>{
	console.log(req.body);
	await pool.query('INSERT INTO usuarios set ?', [req.body]);
	resp.json({message : 'El usuario se registro con exito'});
}

public async delete(req:Request, resp:Response){
	const {id} = req.params;
	await pool.query('DELETE FROM productos WHERE id =?',[id]);
	resp.json({message : 'The product was deleted'});
}

public async listCat(req: Request, resp: Response){
	const {idC} = req.params;
    const productos = await pool.query(`
		SELECT * FROM productos WHERE id_categoria = ? 
		`, [idC]);
    resp.json(productos);
}

public async listCatTop(req: Request, resp: Response){
    const productoTop = await pool.query('SELECT * FROM productos ORDER BY stock ASC LIMIT 6');
    resp.json(productoTop);
}


public async update(req:Request, resp:Response){
	const {id} = req.params;
	await pool.query('UPDATE productos set ? WHERE id = ?', [req.body, id]);

	resp.json({message : 'The product was updated'});
}


public async getOne(req: Request, resp: Response){
	const {id} = req.params;
	const productos = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);

	if(productos.length>0){
		
		return resp.json(productos[0]);		

}
resp.status(404).json({text: 'The product does`nt exists'});
}


}

const productosController = new ProductosController();
export default productosController;
