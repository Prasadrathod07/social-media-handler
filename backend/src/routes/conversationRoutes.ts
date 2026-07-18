import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getConversationMessages,
  listMyConversations,
  sendMessage,
} from "../controllers/conversationController";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listMyConversations));
router.get("/:id/messages", asyncHandler(getConversationMessages));
router.post("/messages", asyncHandler(sendMessage));

export default router;
