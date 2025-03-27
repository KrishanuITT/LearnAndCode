import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import categoriesRoutes from './routes/categoriesRoutes';
import productsRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoute';
import ordersRoutes from './routes/ordersRoutes';
import db from './db';

dotenv.config({ path: './.env' });

class Server {
    app: Express;
    port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.app.use(express.json());
        
        this.initializeRouters();
        this.start();
    }

    initializeRouters() {
        this.app.use('/auth', authRoutes);
        this.app.use('/categories', categoriesRoutes);
        this.app.use('/products', productsRoutes);
        this.app.use('/cart', cartRoutes);
        this.app.use('/orders',ordersRoutes);
        this.app.use(cors());
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

new Server();
