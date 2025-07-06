import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect()
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Database connection error:', err));

export default db;
