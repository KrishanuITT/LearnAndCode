import { OrderController } from '../../src/controllers/ordersControllers'; // Adjust the path if needed
import db from '../../src/db';
import { Request, Response } from 'express';

jest.mock('../../src/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn()
  }
}));

const mockedDb = db as unknown as { query: jest.Mock };

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  return res as Response;
};

describe('OrderController', () => {
    const controller = new OrderController();
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createOrder', () => {
      it('should create order when cart has items', async () => {
        // Given
        const req = {
          body: {
            user_id: 1,
            cart_id: 1,
            status: 'Pending',
          },
        } as Request;
        const res = mockResponse();
  
        mockedDb.query
          .mockResolvedValueOnce({ rows: [{ product_id: 1, quantity: 2, price: '10.0' }] })
          .mockResolvedValueOnce({ rows: [{ id: 1 }] })
          .mockResolvedValue({})
          .mockResolvedValueOnce({});
  
        // When
        await controller.createOrder(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
      });
  
      it('should return 400 if cart is empty', async () => {
        // Given
        const req = { body: { cart_id: 1 } } as Request;
        const res = mockResponse();
        mockedDb.query.mockResolvedValueOnce({ rows: [] });
  
        // When
        await controller.createOrder(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
      });
  
      it('should handle internal error during order creation', async () => {
        // Given
        const req = { body: { cart_id: 1 } } as Request;
        const res = mockResponse();
        mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));
  
        // When
        await controller.createOrder(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
      });
    });
  
    describe('getOrderById', () => {
      it('should return order if found', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
  
        // When
        await controller.getOrderById(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 } });
      });
  
      it('should return 404 if order not found', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockResolvedValueOnce({ rows: [] });
  
        // When
        await controller.getOrderById(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(404);
      });
  
      it('should handle error when fetching order', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));
  
        // When
        await controller.getOrderById(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  
    describe('getOrdersByUserId', () => {
      it('should return orders for user', async () => {
        // Given
        const req = { params: { user_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
  
        // When
        await controller.getOrdersByUserId(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(200);
      });
  
      it('should handle error when fetching user orders', async () => {
        // Given
        const req = { params: { user_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));
  
        // When
        await controller.getOrdersByUserId(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  
    describe('cancelOrder', () => {
      it('should cancel order if found', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
  
        mockedDb.query
          .mockResolvedValueOnce({ rows: [{ id: 1 }] })
          .mockResolvedValueOnce({});
  
        // When
        await controller.cancelOrder(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 404 if order not found', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockResolvedValueOnce({ rows: [] });
  
        // When
        await controller.cancelOrder(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(404);
      });
  
      it('should handle error during cancel', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));
  
        // When
        await controller.cancelOrder(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  
    describe('getOrderItemsByOrderId', () => {
      it('should return order items', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
  
        // When
        await controller.getOrderItemsByOrderId(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(200);
      });
  
      it('should handle error while getting order items', async () => {
        // Given
        const req = { params: { order_id: '1' } } as unknown as Request;
        const res = mockResponse();
        mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));
  
        // When
        await controller.getOrderItemsByOrderId(req, res);
  
        // Then
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });