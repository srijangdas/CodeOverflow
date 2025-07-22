import { db } from "../config/db.js";

export const addAnswer = async (req, res) => {
  const { content } = req.body;
  const { questionId } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "INSERT INTO answers (content, question_id, author_id) VALUES ($1, $2, $3) RETURNING *",
      [content, questionId, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Post answer error:", err.message);
    res.status(500).json({ error: "Could not post answer." });
  }
};

export const markAccepted = async (req, res) => {
  const { id } = req.params;
  await db.query("UPDATE answers SET is_accepted = TRUE WHERE id = $1", [id]);

  await db.query(
    "INSERT INTO notifications (recipient_id, message) VALUES ($1, $2)",
    [answerAuthorId, `Your answer was accepted!`]
  );
  res.json({ message: "Answer marked as accepted" });
};
