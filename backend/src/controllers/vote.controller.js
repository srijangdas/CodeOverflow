import { db } from "../config/db.js";

export const voteAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { vote_type } = req.body; // +1 or -1

  try {
    await db.query(
      `INSERT INTO votes (user_id, answer_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, answer_id)
       DO UPDATE SET vote_type = EXCLUDED.vote_type`,
      [req.user.id, answerId, vote_type]
    );
    res.json({ message: "Vote recorded" });
  } catch (err) {
    res.status(500).json({ error: "Vote failed", detail: err.message });
  }
};
