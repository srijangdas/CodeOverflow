import { db } from "../config/db.js";

export const getAllQuestions = async (req, res) => {
  const result = await db.query(`
    SELECT
        q.*,
        u.username,
        (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) AS answer_count,

        COALESCE((
          SELECT COUNT(*) FROM votes v
          JOIN answers a ON a.id = v.answer_id
          WHERE a.question_id = q.id AND v.vote_type = 1
        ), 0) AS upvotes,

        COALESCE((
          SELECT COUNT(*) FROM votes v
          JOIN answers a ON a.id = v.answer_id
          WHERE a.question_id = q.id AND v.vote_type = -1
        ), 0) AS downvotes,

        ARRAY(
          SELECT t.name
          FROM tags t
          JOIN question_tags qt ON qt.tag_id = t.id
          WHERE qt.question_id = q.id
        ) AS tags

      FROM questions q
      JOIN users u ON u.id = q.author_id
      ORDER BY q.created_at DESC
  `);
  res.json(result.rows);
  console.log(result.rows);
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await db.query(
      `
      SELECT q.*, u.username,
        ARRAY(
          SELECT t.name
          FROM tags t
          JOIN question_tags qt ON qt.tag_id = t.id
          WHERE qt.question_id = q.id
        ) AS tags
      FROM questions q
      JOIN users u ON u.id = q.author_id
      WHERE q.id = $1
    `,
      [id]
    );

    const answers = await db.query(
      `
      SELECT a.*, u.username AS author, 
        COALESCE(SUM(CASE WHEN v.vote_type = 1 THEN 1 WHEN v.vote_type = -1 THEN -1 ELSE 0 END), 0) AS votes
      FROM answers a
      JOIN users u ON u.id = a.author_id
      LEFT JOIN votes v ON v.answer_id = a.id
      WHERE a.question_id = $1
      GROUP BY a.id, u.username
      ORDER BY a.is_accepted DESC, a.created_at ASC
    `,
      [id]
    );

    res.json({
      question: question.rows[0],
      answers: answers.rows,
    });
  } catch (err) {
    console.error("getQuestionById error:", err.message);
    res.status(500).json({ error: "Could not load question." });
  }
};

export const createQuestion = async (req, res) => {
  const { title, description, tags } = req.body;
  const userId = req.user.id;

  console.log(userId);
  const question = await db.query(
    "INSERT INTO questions (title, description, author_id) VALUES ($1, $2, $3) RETURNING *",
    [title, description, userId]
  );

  const qid = question.rows[0].id;

  for (const tagName of tags) {
    let tagId;
    const tagCheck = await db.query("SELECT * FROM tags WHERE name = $1", [
      tagName,
    ]);
    if (tagCheck.rows.length) {
      tagId = tagCheck.rows[0].id;
    } else {
      const inserted = await db.query(
        "INSERT INTO tags (name) VALUES ($1) RETURNING id",
        [tagName]
      );
      tagId = inserted.rows[0].id;
    }
    await db.query(
      "INSERT INTO question_tags (question_id, tag_id) VALUES ($1, $2)",
      [qid, tagId]
    );
  }

  res.status(201).json(question.rows[0]);
};

export const searchQuestions = async (req, res) => {
  const { query, tag, userId, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT q.*, u.username FROM questions q
    JOIN users u ON u.id = q.author_id
    WHERE 1=1
  `;
  const params = [];

  if (query) {
    sql += ` AND (q.title ILIKE $${params.length + 1} OR q.description ILIKE $${
      params.length + 1
    })`;
    params.push(`%${query}%`);
  }

  if (tag) {
    sql += `
      AND q.id IN (
        SELECT question_id FROM question_tags qt
        JOIN tags t ON qt.tag_id = t.id
        WHERE t.name = $${params.length + 1}
      )
    `;
    params.push(tag);
  }

  if (userId) {
    sql += ` AND q.author_id = $${params.length + 1}`;
    params.push(userId);
  }

  sql += ` ORDER BY q.created_at DESC LIMIT $${params.length + 1} OFFSET $${
    params.length + 2
  }`;
  params.push(limit, offset);

  const result = await db.query(sql, params);
  res.json(result.rows);
};
