import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
const db = new sqlite3.Database('./database.sqlite');

const singup = async (req: any, res: any) => {
    try {
        const { name, username, password, email, phone, address } = req.body;

        if (!name || !username || !password || !email || !phone || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (name, username, password, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
            [name, username, hashedPassword, email, phone, address],
            (insertError) => {
                if (insertError) {
                    return res.status(500).json({ error: `Error creating user, ${insertError}` });
                }
                return res.status(201).json({ message: 'User created successfully' });
            }
        );
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const login = (req: any, res: any) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        db.get("SELECT * FROM users WHERE username = ?", [username], async (error, user:any) => {
            if (error) {
                return res.status(500).json({ error: 'Database error while fetching user' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            return res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }    
}

export { singup, login }