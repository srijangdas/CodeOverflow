import express from "express";
import { voteAnswer } from "../controllers/vote.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/:answerId", authenticate, voteAnswer);

export default router;
