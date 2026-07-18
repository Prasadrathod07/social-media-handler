export type Platform = "linkedin" | "x" | "instagram" | "facebook" | "blog";
export type Cadence = "daily" | "weekly" | "monthly";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface PlatformUser {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  onboardingComplete: boolean;
  subscription: {
    cadence?: Cadence;
    status: "trialing" | "active" | "past_due" | "canceled" | "none";
    currentPeriodEnd?: string;
  };
  createdAt: string;
}

export type RiskLevel = "low" | "medium" | "high";

export interface SafetyReview {
  riskLevel: RiskLevel;
  issues: string[];
  recommendation: "approve" | "needs_review" | "block";
  reviewedAt: string;
}

export interface Post {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  platform: Platform;
  content: string;
  status: "draft" | "pendingApproval" | "approved" | "scheduled" | "published" | "failed";
  safetyReview?: SafetyReview;
  decidedBy?: "ai" | "user";
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  cadence: Cadence;
  price: number;
  postsPerCycle: number;
  platformsIncluded: Platform[];
  features: string[];
  active: boolean;
}

export interface PlatformStats {
  totalUsers: number;
  activeSubscriptions: number;
  postsPublished: number;
  postsPendingApproval: number;
  postsFlaggedHighRisk: number;
}
