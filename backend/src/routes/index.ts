import { Router } from "express";
import authRoutes from "./authRoutes";
import profileRoutes from "./profileRoutes";
import socialAccountRoutes from "./socialAccountRoutes";
import scheduleRoutes from "./scheduleRoutes";
import topicRoutes from "./topicRoutes";
import postRoutes from "./postRoutes";
import conversationRoutes from "./conversationRoutes";
import adminRoutes from "./adminRoutes";
import subscriptionRoutes from "./subscriptionRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/social-accounts", socialAccountRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/topics", topicRoutes);
router.use("/posts", postRoutes);
router.use("/conversations", conversationRoutes);
router.use("/admin", adminRoutes);
router.use("/subscription", subscriptionRoutes);

export default router;
