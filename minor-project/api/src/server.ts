import express, { Express } from 'express';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import cors from 'cors';

import authRoutes from './routes/authRoutes';

dotenv.config({ path: './.env' });

class Server {
    app: Express;
    port: string | number;
    db: sqlite3.Database;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.app.use(express.json());

        this.db = new sqlite3.Database('./database.sqlite', (err) => {
            if (err) {
                console.error('Database Connection Error:', err.message);
            } else {
                console.log('Connected to the database.');
            }
        });

        this.initializeRouters();
        this.start();
    }

    initializeRouters() {
        this.app.use('/auth', authRoutes);
        this.app.use(cors());
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

new Server();