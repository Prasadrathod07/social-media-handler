import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireAiActive } from "../middleware/aiGuard";
import { asyncHandler } from "../utils/asyncHandler";
import {
  generatePost,
  generatePostImageForPost,
  listMyPosts,
  updatePostStatus,
} from "../controllers/postController";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listMyPosts));
router.post("/generate", asyncHandler(requireAiActive), asyncHandler(generatePost));
router.post("/:id/generate-image", asyncHandler(requireAiActive), asyncHandler(generatePostImageForPost));
router.patch("/:id/status", asyncHandler(updatePostStatus));

export default router;
