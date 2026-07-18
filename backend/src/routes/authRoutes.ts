import { Router } from "express";
import { completeOnboarding, login, me, refresh, register } from "../controllers/authController";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.get("/me", requireAuth, asyncHandler(me));
router.post("/me/complete-onboarding", requireAuth, asyncHandler(completeOnboarding));

export default router;
