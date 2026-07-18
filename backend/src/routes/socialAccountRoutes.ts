import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import {
  connectSocialAccount,
  disconnectSocialAccount,
  listMySocialAccounts,
} from "../controllers/socialAccountController";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listMySocialAccounts));
router.post("/", asyncHandler(connectSocialAccount));
router.delete("/:platform", asyncHandler(disconnectSocialAccount));

export default router;
