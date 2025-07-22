import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Connected Successfuly");
});
router.post("/register", register);
router.post("/login", login);

export default router;
