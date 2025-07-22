import { db } from "../config/db.js";

export const getNotifications = async (req, res) => {
  const result = await db.query(
    "SELECT * FROM notifications WHERE recipient_id=$1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(result.rows);
};

export const markAsRead = async (req, res) => {
  await db.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND recipient_id = $2",
    [req.params.id, req.user.id]
  );
  res.json({ message: "Notification marked as read" });
};
