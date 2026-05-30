import { db } from "../config/db.js";

export const addAnswer = async (req, res) => {
  const { content } = req.body;
  const { questionId } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "INSERT INTO answers (content, question_id, author_id) VALUES ($1, $2, $3) RETURNING *",
      [content, questionId, userId],
    );

    const answerId = result.rows[0].id;

    // Fetch the answer with author name and vote count
    const fullAnswer = await db.query(
      `SELECT 
        a.id,
        a.content,
        a.question_id,
        a.author_id,
        a.is_accepted,
        a.created_at,
        u.username AS author,
        COALESCE(SUM(CASE WHEN v.vote_type = 1 THEN 1 WHEN v.vote_type = -1 THEN -1 ELSE 0 END), 0) AS votes
       FROM answers a
       JOIN users u ON u.id = a.author_id
       LEFT JOIN votes v ON v.answer_id = a.id
       WHERE a.id = $1
       GROUP BY a.id, u.username`,
      [answerId],
    );

    res.status(201).json(fullAnswer.rows[0]);
  } catch (err) {
    console.error("Post answer error:", err.message);
    res.status(500).json({ error: "Could not post answer." });
  }
};

export const markAccepted = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the answer author ID first
    const answerResult = await db.query(
      "SELECT author_id, question_id FROM answers WHERE id = $1",
      [id],
    );

    if (answerResult.rows.length === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const { author_id: answerAuthorId, question_id: questionId } =
      answerResult.rows[0];

    // Update answer to accepted
    await db.query("UPDATE answers SET is_accepted = TRUE WHERE id = $1", [id]);

    // Create notification for answer author
    await db.query(
      "INSERT INTO notifications (recipient_id, message) VALUES ($1, $2)",
      [answerAuthorId, `Your answer was accepted!`],
    );

    res.json({ message: "Answer marked as accepted" });
  } catch (err) {
    console.error("Mark accepted error:", err.message);
    res.status(500).json({ error: "Could not mark answer as accepted." });
  }
};
