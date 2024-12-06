import { Router } from "express";
import carritoController from "../controllers/carritoController";


class CarritoRoutes{
    public router : Router = Router();


    constructor(){
        this.config();
    }
    config():void{
        this.router.post('/crear/',carritoController.create);
        this.router.get('/ventas-us/:id_usuario', carritoController.listVentasByUsuario);
        this.router.get('/ventas', carritoController.listAllVentas);
        this.router.get('/ventas/:id', carritoController.getVentaById);

    }

}
const carritoRoutes= new CarritoRoutes;
export default carritoRoutes.router;