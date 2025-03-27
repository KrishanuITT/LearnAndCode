import db from '../db';

const getAllProducts = async (req: any, res: any) => {
    try {
        const { rows: products } = await db.query('SELECT * FROM products;');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getProductById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM products WHERE id = $1;', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getProductsByCategory = async (req: any, res: any) => {
    try {
        const { category_id } = req.params;
        const { rows: products } = await db.query('SELECT * FROM products WHERE category_id = $1;', [category_id]);

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for this category' });
        }

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

export { getAllProducts, getProductById, getProductsByCategory };
