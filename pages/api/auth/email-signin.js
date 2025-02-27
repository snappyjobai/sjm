import { createPool } from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, action } = req.body;

  try {
    if (action === "register") {
      // Hash password and create new user
      const hashedPassword = await bcrypt.hash(password, 12);
      await pool.query(
        'INSERT INTO users (email, password, plan_type) VALUES (?, ?, "free")',
        [email, hashedPassword]
      );

      return res.status(201).json({ success: true });
    } else {
      // Verify existing user
      const [users] = await pool.query(
        "SELECT id, password FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, users[0].password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create session token
      const token = jwt.sign(
        { userId: users[0].id, email },
        process.env.NEXTAUTH_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({ success: true, token });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
