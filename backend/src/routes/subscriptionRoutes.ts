import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { listActivePlans, selectPlan } from "../controllers/subscriptionController";

const router = Router();

router.use(requireAuth);
router.get("/plans", asyncHandler(listActivePlans));
router.post("/select", asyncHandler(selectPlan));

export default router;
