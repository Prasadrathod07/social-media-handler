import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { addUpload, getMyProfile, upsertMyProfile } from "../controllers/profileController";

const router = Router();

router.use(requireAuth);
router.get("/me", asyncHandler(getMyProfile));
router.put("/me", asyncHandler(upsertMyProfile));
router.post("/me/uploads", asyncHandler(addUpload));

export default router;
