import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Add request logging
router.post("/register", (req, res, next) => {
  console.log('Register request received:', req.body);
  registerUser(req, res, next);
});

router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Auth Route Error:', err);
  res.status(500).json({ error: err.message || 'Something went wrong' });
});

export default router;