import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { generateToken } from "../utils/token.utils.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUserEmail = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUserEmail.rows.length)
      return res.status(400).json({ message: "Email already exists" });

    const existingUsername = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (existingUsername.rows.length)
      return res.status(400).json({ message: "Username already exists" });

    const result = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const token = generateToken(result.rows[0].id);
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", detail: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid Email" });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid Password" });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", detail: err.message });
  }
};
