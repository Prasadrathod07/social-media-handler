import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createPlan,
  getPlatformStats,
  getUserDetail,
  listAllPosts,
  listPlans,
  listUsers,
  setUserRole,
  updatePlan,
} from "../controllers/adminController";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", asyncHandler(getPlatformStats));

router.get("/users", asyncHandler(listUsers));
router.get("/users/:id", asyncHandler(getUserDetail));
router.patch("/users/:id/role", asyncHandler(setUserRole));

router.get("/posts", asyncHandler(listAllPosts));

router.get("/plans", asyncHandler(listPlans));
router.post("/plans", asyncHandler(createPlan));
router.patch("/plans/:id", asyncHandler(updatePlan));

export default router;
