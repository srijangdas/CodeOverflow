import { db } from "../config/db.js";

export const voteAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { vote_type } = req.body; // +1 or -1

  try {
    // Record the vote
    await db.query(
      `INSERT INTO votes (user_id, answer_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, answer_id)
       DO UPDATE SET vote_type = EXCLUDED.vote_type`,
      [req.user.id, answerId, vote_type],
    );

    // Get updated answer with vote count
    const result = await db.query(
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

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Vote error:", err.message);
    res.status(500).json({ error: "Vote failed", detail: err.message });
  }
};
