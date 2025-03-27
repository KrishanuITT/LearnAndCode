import db from '../db';
const addToCart = async (req: any, res: any) => {
    try {
        const { cart_id, product_id, quantity, price } = req.body;

        const { rows: existingRows } = await db.query(
            `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2;`,
            [cart_id, product_id]
        );

        if (existingRows.length > 0) {
            const updatedItem = await db.query(
                `UPDATE cart_items 
                 SET quantity = quantity + $1 
                 WHERE cart_id = $2 AND product_id = $3 
                 RETURNING *;`,
                [quantity, cart_id, product_id]
            );

            return res.status(200).json({ success: true, message: 'Quantity updated', data: updatedItem.rows[0] });
        }

        const { rows } = await db.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity, price) 
             VALUES ($1, $2, $3, $4) RETURNING *;`,
            [cart_id, product_id, quantity, price]
        );

        res.status(201).json({ success: true, message: 'Item added to cart', data: rows[0] });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};


const getCartItems = async (req: any, res: any) => {
    try {
        const { cart_id } = req.params;
        const { rows: items } = await db.query('SELECT * FROM cart_items WHERE cart_id = $1;', [cart_id]);

        if (items.length === 0) {
            return res.status(404).json({ success: false, message: 'No items found in the cart' });
        }

        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const updateCartItem = async (req: any, res: any) => {
    try {
        const { item_id } = req.params;
        const { quantity } = req.body;
        const { rows } = await db.query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *;',
            [quantity, item_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const removeCartItem = async (req: any, res: any) => {
    try {
        const { item_id } = req.params;
        const { rows } = await db.query('DELETE FROM cart_items WHERE id = $1 RETURNING *;', [item_id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        res.status(200).json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const createCart = async (req: any, res: any) => {
    try {
        const { user_id } = req.body;
        const { rows } = await db.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *;', [user_id]);
        res.status(201).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server ', error });
    }
};

const getCart = async (req: any, res: any) => {
    try {
        const { user_id } = req.params;
        const { rows } = await db.query('SELECT * FROM cart WHERE user_id = $1;', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const emptyCart = async (req: any, res: any) => {
    try {
        const { user_id } = req.params;
        const { rows } = await db.query('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM cart WHERE user_id = $1) RETURNING *;', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No items found in cart' });
        }

        res.status(200).json({ success: true, message: 'Cart emptied successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};


export { addToCart, getCartItems, updateCartItem, removeCartItem, emptyCart, getCart, createCart };
