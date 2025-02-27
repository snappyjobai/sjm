import { createPool } from "mysql2/promise";
import bcrypt from "bcryptjs";

// Create a pool of connections to the database
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  // Ensure this route only handles POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract user data from the request body
  const { email, password, name } = req.body;

  // Ensure all required fields are provided
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if user already exists in the database
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert the new user into the database
    const [result] = await pool.query(
      "INSERT INTO users (email, password, name, plan_type) VALUES (?, ?, ?, 'free')",
      [email, hashedPassword, name]
    );

    // The result contains the insertId, which is the ID of the newly inserted row
    const newUserId = result.insertId;

    // Return success response with the new user ID
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUserId,
        email,
        name,
        plan_type: "free",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    // Return error response in case of any failures
    return res.status(500).json({ error: "Internal server error" });
  }
}
