import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/role.middleware.js";
import {
  deleteAnswer,
  deleteQuestion,
  listUsers,
  banUser,
} from "../controllers/admin.controller.js";
const router = express.Router();

router.use(authenticate);
router.use(authorizeRole("admin"));

router.delete("/question/:id", deleteQuestion);
router.delete("/answer/:id", deleteAnswer);
router.get("/users", listUsers);
router.patch("/users/:id/ban", banUser);

export default router;
