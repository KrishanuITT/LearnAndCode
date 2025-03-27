import { Request, Response } from 'express';
import db from '../db';

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const { rows: categories } = await db.query('SELECT * FROM categories;');
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getCategory = async (req: any, res: any) => {
    try {
        const { categoryName } = req.params;
        const { rows } = await db.query('SELECT * FROM categories WHERE name = $1', [categoryName]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

export { getAllCategories, getCategory };
