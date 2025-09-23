// routes/authRoutes.js
import express from "express";

import { signup, login, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

// signup route
router.post("/signup", signup);

// login route
router.post("/login", login);

// refresh token route
router.post("/refresh", refresh);

// logout route
router.post("/logout", logout);

// get user profile (protected route)
// router.get("/me", getMe);

export default router;
