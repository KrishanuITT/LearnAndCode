import { ProductController } from '../../src/controllers/productsController';
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

describe('ProductController', () => {
  const controller = new ProductController();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products successfully', async () => {
      // Given
      const req = {} as Request;
      const res = mockResponse();
      mockedDb.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Product' }] });

      // When
      await controller.getAllProducts(req, res);

      // Then
      expect(mockedDb.query).toHaveBeenCalledWith('SELECT * FROM products;');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 1, name: 'Test Product' }] });
    });

    it('should handle database error', async () => {
      // Given
      const req = {} as Request;
      const res = mockResponse();
      mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));

      // When
      await controller.getAllProducts(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('getProductById', () => {
    it('should return product by ID', async () => {
      // Given
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
      mockedDb.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Product' }] });

      // When
      await controller.getProductById(req, res);

      // Then
      expect(mockedDb.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = $1;', ['1']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1, name: 'Test Product' } });
    });

    it('should return 404 if product not found', async () => {
      // Given
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
      mockedDb.query.mockResolvedValueOnce({ rows: [] });

      // When
      await controller.getProductById(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Product not found' });
    });

    it('should handle DB error for getProductById', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
      mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));

      await controller.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for a category', async () => {
      // Given
      const req = { params: { category_id: '10' } } as unknown as Request;
      const res = mockResponse();
      mockedDb.query.mockResolvedValueOnce({ rows: [{ id: 2, name: 'Category Product' }] });

      // When
      await controller.getProductsByCategory(req, res);

      // Then
      expect(mockedDb.query).toHaveBeenCalledWith('SELECT * FROM products WHERE category_id = $1;', ['10']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 2, name: 'Category Product' }] });
    });

    it('should return 404 if no products found in category', async () => {
      // Given
      const req = { params: { category_id: '10' } } as unknown as Request;
      const res = mockResponse();
      mockedDb.query.mockResolvedValueOnce({ rows: [] });

      // When
      await controller.getProductsByCategory(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No products found for this category' });
    });

    it('should handle DB error for category query', async () => {
      // Given
      const req = { params: { category_id: '10' } } as unknown as Request;
      const res = mockResponse();
      mockedDb.query.mockRejectedValueOnce(new Error('DB Error'));

      // When
      await controller.getProductsByCategory(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });
});
