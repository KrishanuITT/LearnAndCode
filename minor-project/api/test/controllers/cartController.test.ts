import { CartController } from '../../src/controllers/cartController';
import db from '../../src/db';

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
};

beforeEach(() => {
    jest.clearAllMocks();
});

const controller = new CartController();

describe('CartController', () => {

    describe('addToCart', () => {
        it('should update quantity if item already exists in cart', async () => {
            // Given
            const req = { body: { cart_id: 1, product_id: 1, quantity: 2, price: 100 } };
            mockedDb.query
                .mockResolvedValueOnce({ rows: [{ id: 1 }] })
                .mockResolvedValueOnce({ rows: [{ id: 1, quantity: 4 }] });

            // When
            await controller.addToCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Quantity updated',
                data: { id: 1, quantity: 4 }
            });
        });

        it('should insert item if it does not exist in cart', async () => {
            // Given
            const req = { body: { cart_id: 1, product_id: 2, quantity: 3, price: 150 } };
            mockedDb.query
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [{ id: 2, quantity: 3 }] });

            // When
            await controller.addToCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Item added to cart',
                data: { id: 2, quantity: 3 }
            });
        });

        it('should return 500 if database throws an error', async () => {
            // Given
            const req = { body: { cart_id: 1, product_id: 3, quantity: 1, price: 50 } };
            mockedDb.query.mockRejectedValue(new Error('DB error'));

            // When
            await controller.addToCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getCartItems', () => {
        it('should return items in the cart', async () => {
            // Given
            const req = { params: { cart_id: 1 } };
            mockedDb.query.mockResolvedValue({ rows: [{ id: 1, product_name: 'Item A' }] });

            // When
            await controller.getCartItems(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if no items found', async () => {
            // Given
            const req = { params: { cart_id: 1 } };
            mockedDb.query.mockResolvedValue({ rows: [] });

            // When
            await controller.getCartItems(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on DB error', async () => {
            // Given
            const req = { params: { cart_id: 1 } };
            mockedDb.query.mockRejectedValue(new Error('DB Error'));

            // When
            await controller.getCartItems(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateCartItem', () => {
        it('should update an existing cart item', async () => {
            // Given
            const req = { params: { item_id: 1 }, body: { quantity: 5 } };
            mockedDb.query.mockResolvedValue({ rows: [{ id: 1, quantity: 5 }] });

            // When
            await controller.updateCartItem(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if item does not exist', async () => {
            // Given
            const req = { params: { item_id: 1 }, body: { quantity: 5 } };
            mockedDb.query.mockResolvedValue({ rows: [] });

            // When
            await controller.updateCartItem(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on error', async () => {
            // Given
            const req = { params: { item_id: 1 }, body: { quantity: 5 } };
            mockedDb.query.mockRejectedValue(new Error('DB Error'));

            // When
            await controller.updateCartItem(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('removeCartItem', () => {
        it('should remove all items for a user', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockResolvedValue({});

            // When
            await controller.removeCartItem(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on error', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockRejectedValue(new Error('Error'));

            // When
            await controller.removeCartItem(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createCart', () => {
        it('should create a new cart for user', async () => {
            // Given
            const req = { body: { user_id: 1 } };
            mockedDb.query.mockResolvedValue({ rows: [{ id: 1 }] });

            // When
            await controller.createCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 500 on error', async () => {
            // Given
            const req = { body: { user_id: 1 } };
            mockedDb.query.mockRejectedValue(new Error('DB Error'));

            // When
            await controller.createCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getCart', () => {
        it('should return the cart for a user', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockResolvedValue({ rows: [{ id: 1 }] });

            // When
            await controller.getCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if cart does not exist', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockResolvedValue({ rows: [] });

            // When
            await controller.getCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on error', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockRejectedValue(new Error('Error'));

            // When
            await controller.getCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('emptyCart', () => {
        it('should empty the cart successfully', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockResolvedValue({ rows: [{ id: 1 }] });

            // When
            await controller.emptyCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if cart was already empty', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockResolvedValue({ rows: [] });

            // When
            await controller.emptyCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on error', async () => {
            // Given
            const req = { params: { user_id: 1 } };
            mockedDb.query.mockRejectedValue(new Error('Error'));

            // When
            await controller.emptyCart(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

});
