import db from '../db';
import bcrypt from 'bcrypt';

export class AuthController {
  async signup(req: any, res: any) {
    try {
      const { name, username, password, email, phone, address } = req.body;

      if (!name || !username || !password || !email || !phone || !address) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, username, password, email, phone, address) VALUES ($1, $2, $3, $4, $5, $6)",
        [name, username, hashedPassword, email, phone, address],
        (insertError) => {
          if (insertError) {
            return res.status(500).json({ error: `Error creating user: ${insertError.message}` });
          }

          return res.status(201).json({ message: "User created successfully" });
        }
      );
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req: any, res: any) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
