import express from 'express';
import { registerUser, loginUser, getUserProfile } from "../controller/user";
import { authenticateJWT } from "../midlleware/authmiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authenticateJWT, getUserProfile);

export default router;