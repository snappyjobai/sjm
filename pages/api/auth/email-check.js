import { createPool } from "mysql2/promise";

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

  const { email } = req.body;

  try {
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    return res.status(200).json({
      exists: users.length > 0,
      message: users.length > 0 ? "User exists" : "New user",
    });
  } catch (error) {
    console.error("Email check error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
