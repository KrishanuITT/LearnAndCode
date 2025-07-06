import { Request, Response } from 'express';
import db from '../db';

export class OrderController {
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, cart_id, status } = req.body;

      const { rows: cartItems } = await db.query(
        `SELECT product_id, quantity, price FROM cart_items WHERE cart_id = $1;`,
        [cart_id]
      );

      if (cartItems.length === 0) {
        res.status(400).json({ success: false, message: 'Cart is empty' });
        return;
      }

      const total_amount = cartItems.reduce(
        (sum, item) => sum + item.quantity * parseFloat(item.price),
        0
      );

      const { rows: orderRows } = await db.query(
        `INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id;`,
        [user_id, total_amount, status]
      );

      const order_id = orderRows[0].id;

      await Promise.all(
        cartItems.map((item) =>
          db.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4);`,
            [order_id, item.product_id, item.quantity, item.price]
          )
        )
      );

      await db.query(`DELETE FROM cart_items WHERE cart_id = $1;`, [cart_id]);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order_id,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { order_id } = req.params;

      const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [
        order_id,
      ]);

      if (rows.length === 0) {
        res
          .status(404)
          .json({ success: false, message: 'Order not found' });
        return;
      }

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error('Error fetching order:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  }

  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const { rows } = await db.query(
        'SELECT * FROM orders WHERE user_id = $1',
        [user_id]
      );

      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { order_id } = req.params;

      const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [
        order_id,
      ]);

      if (rows.length === 0) {
        res
          .status(404)
          .json({ success: false, message: 'Order not found' });
        return;
      }

      await db.query('UPDATE orders SET status = $1 WHERE id = $2', [
        'Cancelled',
        order_id,
      ]);

      res
        .status(200)
        .json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling order:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  }

  async getOrderItemsByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const { order_id } = req.params;

      const { rows } = await db.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order_id]
      );

      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error('Error fetching order items:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', error });
    }
  }
}
