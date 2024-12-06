"use strict";
console.log(`WORKS!!!!!`);
import express, { Application } from 'express';
import indexRoutes from './routes/indexRoutes';
import productosRoutes from './routes/productosRoutes';
import morgan from 'morgan';
import cors from 'cors';
import carritoRoutes from './routes/carritoRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import emailRoutes from './routes/emailRoutes';


class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended : false}))
    }

    routes(): void {
        this.app.use('/',indexRoutes)
        this.app.use('/api/productos', productosRoutes)  // Aquí se definen las rutas para productos
        this.app.use('/api/carrito', carritoRoutes)
        this.app.use('/api/usuario', usuariosRoutes)
        this.app.use('/api/email', emailRoutes)
        // Aquí puedes definir tus rutas
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

// Crear una instancia de la clase Server para iniciar la aplicación
const server = new Server();
server.start();


