export type Platform = "linkedin" | "x" | "instagram" | "facebook" | "blog";
export type Cadence = "daily" | "weekly" | "monthly";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  onboardingComplete: boolean;
  aiPaused: boolean;
  subscription?: {
    planId?: string;
    cadence?: Cadence;
    status: "trialing" | "active" | "past_due" | "canceled" | "none";
    currentPeriodEnd?: string;
  };
}

export type RiskLevel = "low" | "medium" | "high";

export interface SafetyReview {
  riskLevel: RiskLevel;
  issues: string[];
  recommendation: "approve" | "needs_review" | "block";
  reviewedAt: string;
}

export interface Profile {
  resumeText?: string;
  bio?: string;
  aboutMe?: string;
  tone: string[];
  focusAreas: string[];
  rawUploads: { type: "resume" | "note" | "image"; fileUrl: string; uploadedAt: string }[];
}

export interface SocialAccount {
  _id: string;
  platform: Platform;
  platformHandle?: string;
  status: "active" | "expired" | "revoked";
  connectedAt: string;
}

export interface Schedule {
  _id: string;
  cadence: Cadence;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  autoPublish: boolean;
  platforms: Platform[];
  active: boolean;
}

export interface Topic {
  _id: string;
  subjectText: string;
  suggestedBy: "ai" | "user";
  status: "pending" | "approved" | "rejected";
  platformTargets: Platform[];
  createdAt: string;
}

export interface Post {
  _id: string;
  topicId?: string;
  platform: Platform;
  content: string;
  mediaUrls: string[];
  status: "draft" | "pendingApproval" | "approved" | "scheduled" | "published" | "failed";
  safetyReview?: SafetyReview;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  role: "user" | "agent";
  text: string;
  imageUrls: string[];
  createdAt: string;
}
