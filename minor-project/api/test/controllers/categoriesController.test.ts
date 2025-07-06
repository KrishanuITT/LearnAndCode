import { getAllCategories, getCategory } from '../../src/controllers/categoriesController';
import db from '../../src/db';
import { Request, Response } from 'express';

jest.mock('../../src/db', () => ({
    __esModule: true,
    default: {
        query: jest.fn()
    }
}));

const mockedDb = db as unknown as {
    query: jest.Mock;
};

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as Partial<Response>;
  
const typedRes = res as unknown as Response;
  

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Category Controller', () => {

    describe('getAllCategories', () => {
        it('should return all categories', async () => {
            // Given
            const req = {} as Request;
            const categories = [{ id: 1, name: 'Electronics' }, { id: 2, name: 'Books' }];
            mockedDb.query.mockResolvedValue({ rows: categories });

            // When
            await getAllCategories(req, res as Response);

            // Then
            expect(mockedDb.query).toHaveBeenCalledWith('SELECT * FROM categories;');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: categories
            });
        });

        it('should return 500 on database error', async () => {
            // Given
            const req = {} as Request;
            mockedDb.query.mockRejectedValue(new Error('DB Error'));

            // When
            await getAllCategories(req, res as Response);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal Server Error',
                error: expect.any(Error)
            });
        });
    });

    describe('getCategory', () => {
        it('should return a specific category by name', async () => {
            // Given
            const req = { params: { categoryName: 'Electronics' } } as unknown as Request;
            const category = [{ id: 1, name: 'Electronics' }];
            mockedDb.query.mockResolvedValue({ rows: category });

            // When
            await getCategory(req, res as Response);

            // Then
            expect(mockedDb.query).toHaveBeenCalledWith(
                'SELECT * FROM categories WHERE name = $1',
                ['Electronics']
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: category[0]
            });
        });

        it('should return 404 if category not found', async () => {
            // Given
            const req = { params: { categoryName: 'NonExistent' } } as unknown as Request;
            mockedDb.query.mockResolvedValue({ rows: [] });

            // When
            await getCategory(req, res as Response);

            // Then
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Category not found'
            });
        });

        it('should return 500 on database error', async () => {
            // Given
            const req = { params: { categoryName: 'Electronics' } } as unknown as Request;
            mockedDb.query.mockRejectedValue(new Error('DB Error'));

            // When
            await getCategory(req, res as Response);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal Server Error',
                error: expect.any(Error)
            });
        });
    });

});
