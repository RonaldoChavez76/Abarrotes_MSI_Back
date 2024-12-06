import {Request, Response} from 'express';
import pool from '../database';

class UsuariosController{

	
    public async createUs(req: Request, resp: Response): Promise<void>{
        console.log(req.body);
        await pool.query('INSERT INTO usuarios set ?', [req.body]);
        resp.json({message : 'User Saved'});
    }

    public async update(req:Request, resp:Response){
        const {id} = req.params;
        await pool.query('UPDATE usuarios set ? WHERE id = ?', [req.body, id]);
    
        resp.json({message : 'The user was updated'});
    }

    public async delete(req:Request, resp:Response){
        const {id} = req.params;
        await pool.query('DELETE FROM usuarios WHERE id =?',[id]);
        resp.json({message : 'The user was deleted'});
    }

    public async login(req: Request, resp: Response): Promise<void> {
        const { email, password } = req.body;
        const result = await pool.query('SELECT u.id, u.nombre, u.email, tu.id AS tipo_usuario FROM usuarios u JOIN tipo_usuario tu ON u.id_tipo_usuario = tu.id WHERE u.email = ? AND u.password = ?', [email, password]);
        
        if (result.length > 0) {
            resp.json(result[0]);
        } else {
            resp.status(401).json({ message: 'Invalid email or password' });
            
        }
    }

    public async getOne(req: Request, resp: Response){
        const {id} = req.params;
        const usuarios = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    
        if(usuarios.length>0){
            
            return resp.json(usuarios[0]);		
    
    }
    resp.status(404).json({text: 'The user does`nt exists'});
    }

    public async list(req : Request, resp : Response){
		const usuarios = await pool.query('SELECT * FROM usuarios');
		resp.json(usuarios);
}

public async getByTipoUsuario(req: Request, resp: Response): Promise<void> {
    const { id } = req.params;
    const usuarios = await pool.query('SELECT * FROM usuarios WHERE id_tipo_usuario = ?', [id]);
    
    if (usuarios.length > 0) {
        resp.json(usuarios);
    } else {
        resp.status(404).json({ message: 'No users found for this type' });
    }
}

    


}

const usuariosController = new UsuariosController();
export default usuariosController;
