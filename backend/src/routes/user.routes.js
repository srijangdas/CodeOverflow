import express from "express";
import {
  getUserAnswers,
  getUserQuestions,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUserProfile);
router.get("/:id/questions", getUserQuestions);
router.get("/:id/answers", getUserAnswers);

export default router;
