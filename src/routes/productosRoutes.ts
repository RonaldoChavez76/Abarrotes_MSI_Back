import { Router } from "express";
import productosController from "../controllers/productosController";


class ProductosRoutes{
    public router : Router = Router();


    constructor(){
        
        this.config();
    }

    config():void{
        this.router.get('/',productosController.list);
        this.router.get('/top/', productosController.listCatTop);

        this.router.get('/categoria/:idC', productosController.listCat);
        this.router.post('/',productosController.create);
        this.router.post('/crear/',productosController.createUs);
        this.router.delete('/:id', productosController.delete);
        this.router.put('/:id', productosController.update);
        this.router.get('/:id', productosController.getOne);


       
    }
}


const productosRoutes= new ProductosRoutes;
export default productosRoutes.router;