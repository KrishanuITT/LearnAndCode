import { Request, Response } from 'express';
import db from '../db';

export class ProductController {
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { rows: products } = await db.query('SELECT * FROM products;');
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rows } = await db.query('SELECT * FROM products WHERE id = $1;', [id]);

      if (rows.length === 0) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category_id } = req.params;
      const { rows: products } = await db.query('SELECT * FROM products WHERE category_id = $1;', [category_id]);

      if (products.length === 0) {
        res.status(404).json({ success: false, message: 'No products found for this category' });
        return;
      }

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
  }
}
