import { db } from "../config/db.js";

export const deleteQuestion = async (req, res) => {
  await db.query("DELETE FROM questions WHERE id=$1", [req.params.id]);
  res.json({ message: "Question deleted" });
};

export const deleteAnswer = async (req, res) => {
  await db.query("DELETE FROM answers WHERE id=$1", [req.params.id]);
  res.json({ message: "Answer deleted" });
};

export const listUsers = async (req, res) => {
  const users = await db.query("SELECT id, username, email, role FROM users");
  res.json(users.rows);
};

export const banUser = async (req, res) => {
  await db.query("UPDATE users SET role = 'banned' WHERE id = $1", [
    req.params.id,
  ]);
  res.json({ message: "User banned" });
};
