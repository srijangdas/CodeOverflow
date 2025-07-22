import { db } from "../config/db.js";

export const getUserProfile = async (req, res) => {
  const user = await db.query(
    "SELECT id, username, email, role, created_at FROM users WHERE id=$1",
    [req.params.id]
  );
  res.json(user.rows[0]);
};

export const getUserQuestions = async (req, res) => {
  const result = await db.query(
    "SELECT * FROM questions WHERE author_id = $1 ORDER BY created_at DESC",
    [req.params.id]
  );
  res.json(result.rows);
};

export const getUserAnswers = async (req, res) => {
  const result = await db.query(
    `
    SELECT a.*, q.title FROM answers a 
    JOIN questions q ON a.question_id = q.id
    WHERE a.author_id = $1
    ORDER BY a.created_at DESC
  `,
    [req.params.id]
  );
  res.json(result.rows);
};
