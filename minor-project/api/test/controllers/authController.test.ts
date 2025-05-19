import { AuthController } from '../../src/controllers/authControllers';
import db from '../../src/db';
import bcrypt from 'bcrypt';

jest.mock('../../src/db');
jest.mock('bcrypt');

describe('AuthController', () => {
  let authController: AuthController;
  let req: any;
  let res: any;

  beforeEach(() => {
    authController = new AuthController();

    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('Given missing fields, When signup is called, Then respond with 400', async () => {
      // Given
      req.body = { username: 'user' }

      // When
      await authController.signup(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    });

    it('Given valid fields, When signup is called, Then hash password and insert user', async () => {
      // Given
      req.body = {
        name: 'John',
        username: 'john123',
        password: 'pass',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 St',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      (db.query as jest.Mock).mockImplementation((query, values, callback) => {
        callback(null);
      });

      // When
      await authController.signup(req, res);

      // Then
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        ['John', 'john123', 'hashedPassword', 'john@example.com', '1234567890', '123 St'],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });

    it('Given db insert error, When signup is called, Then respond with 500 and error message', async () => {
      // Given
      req.body = {
        name: 'John',
        username: 'john123',
        password: 'pass',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 St',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      (db.query as jest.Mock).mockImplementation((query, values, callback) => {
        callback(new Error('Insert failed'));
      });

      // When
      await authController.signup(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating user: Insert failed' });
    });

    it('Given unexpected error, When signup is called, Then respond with 500', async () => {
      // Given
      req.body = {
        name: 'John',
        username: 'john123',
        password: 'pass',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 St',
      };

      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When
      await authController.signup(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
      expect(consoleSpy).toHaveBeenCalledWith('Signup error:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('login', () => {
    it('Given missing username or password, When login is called, Then respond with 400', async () => {
      // Given
      req.body = { username: 'user' };

      // When
      await authController.login(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
    });

    it('Given non-existing user, When login is called, Then respond with 401', async () => {
      // Given
      req.body = { username: 'user', password: 'pass' };

      (db.query as jest.Mock).mockResolvedValue({ rows: [] });

      // When
      await authController.login(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid username or password' });
    });

    it('Given wrong password, When login is called, Then respond with 401', async () => {
      // Given
      req.body = { username: 'user', password: 'wrongpass' };

      (db.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, name: 'John', email: 'john@example.com', password: 'hashedPass' }],
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // When
      await authController.login(req, res);

      // Then
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpass', 'hashedPass');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid username or password' });
    });

    it('Given correct credentials, When login is called, Then respond with user info', async () => {
      // Given
      req.body = { username: 'user', password: 'rightpass' };

      (db.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, name: 'John', email: 'john@example.com', password: 'hashedPass' }],
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // When
      await authController.login(req, res);

      // Then
      expect(bcrypt.compare).toHaveBeenCalledWith('rightpass', 'hashedPass');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: { id: 1, name: 'John', email: 'john@example.com' },
      });
    });

    it('Given unexpected error, When login is called, Then respond with 500', async () => {
      // Given
      req.body = { username: 'user', password: 'pass' };

      (db.query as jest.Mock).mockRejectedValue(new Error('DB error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When
      await authController.login(req, res);

      // Then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
      expect(consoleSpy).toHaveBeenCalledWith('Login error:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
