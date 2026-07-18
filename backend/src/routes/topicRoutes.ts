import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireAiActive } from "../middleware/aiGuard";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createTopic,
  generateTopicSuggestions,
  listMyTopics,
  updateTopicStatus,
} from "../controllers/topicController";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listMyTopics));
router.post("/", asyncHandler(createTopic));
router.post("/suggest", asyncHandler(requireAiActive), asyncHandler(generateTopicSuggestions));
router.patch("/:id/status", asyncHandler(updateTopicStatus));

export default router;
