import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { generatePost, listMyPosts, updatePostStatus } from "../controllers/postController";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listMyPosts));
router.post("/generate", asyncHandler(generatePost));
router.patch("/:id/status", asyncHandler(updatePostStatus));

export default router;
