import { Router } from "express";
import usuariosController from "../controllers/usuariosController";



class UsuariosRoutes{
    public router : Router = Router();


    constructor(){
        
        this.config();
    }

    config():void{
        this.router.get('/',usuariosController.list);
        this.router.post('/',usuariosController.createUs);
        this.router.delete('/:id', usuariosController.delete);
        this.router.put('/:id', usuariosController.update);
        this.router.post('/login', usuariosController.login); 
        this.router.get('/:id', usuariosController.getOne);
        //this.router.post('/enviar-correo', usuariosController.enviarCorreo);
        this.router.get('/tipo_usuario/:id', usuariosController.getByTipoUsuario);


    }
    }



const usuariosRoutes= new UsuariosRoutes;
export default usuariosRoutes.router;