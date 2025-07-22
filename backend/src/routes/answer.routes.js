import express from "express";
import { addAnswer, markAccepted } from "../controllers/answer.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/:questionId", authenticate, addAnswer);
router.patch("/:id/accept", authenticate, markAccepted);

export default router;
