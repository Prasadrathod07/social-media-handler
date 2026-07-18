import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createSchedule,
  deleteSchedule,
  listMySchedules,
  updateSchedule,
} from "../controllers/scheduleController";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listMySchedules));
router.post("/", asyncHandler(createSchedule));
router.patch("/:id", asyncHandler(updateSchedule));
router.delete("/:id", asyncHandler(deleteSchedule));

export default router;
