"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Ban, PauseCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { getUserDetail, setUserRole } from "@/lib/adminApi";
import { RiskLevel, UserDetail } from "@/types";

const statusTone: Record<string, "warning" | "success" | "brand" | "danger" | "neutral"> = {
  draft: "neutral",
  pendingApproval: "warning",
  approved: "brand",
  scheduled: "brand",
  published: "success",
  failed: "danger",
};

const riskTone: Record<RiskLevel, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetail(id)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleRole() {
    if (!detail) return;
    const nextRole = detail.user.role === "admin" ? "user" : "admin";
    const updated = await setUserRole(detail.user._id, nextRole);
    setDetail((prev) => (prev ? { ...prev, user: { ...prev.user, role: updated.role } } : prev));
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (!detail) {
    return <p className="text-sm text-muted">User not found.</p>;
  }

  const { user, profile, schedules, socialAccounts, recentPosts, postCounts } = detail;

  return (
    <div className="max-w-5xl">
      <button
        onClick={() => router.push("/users")}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
            <Badge label={user.role} tone={user.role === "admin" ? "brand" : "neutral"} />
            {user.aiPaused ? <Badge label="AI paused" tone="danger" /> : null}
          </div>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={toggleRole}>
          {user.role === "admin" ? "Revoke admin" : "Make admin"}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Subscription</p>
          <p className="mt-1 text-lg font-semibold capitalize">{user.subscription.cadence ?? "No plan"}</p>
          <div className="mt-2">
            <Badge label={user.subscription.status} tone={user.subscription.status === "active" ? "success" : "neutral"} />
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted">Joined</p>
          <p className="mt-1 text-lg font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
          <div className="mt-2">
            <Badge label={user.onboardingComplete ? "Onboarded" : "Incomplete onboarding"} tone={user.onboardingComplete ? "success" : "warning"} />
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted">AI status</p>
          <div className="mt-2 flex items-center gap-2">
            {user.aiPaused ? (
              <>
                <PauseCircle className="h-4 w-4 text-danger" />
                <span className="text-sm font-medium text-danger">Paused by user</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Active</span>
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold">Profile</h2>
          {profile ? (
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted">About</p>
                <p className="mt-0.5">{profile.aboutMe || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Bio / tone</p>
                <p className="mt-0.5">{profile.bio || "—"}</p>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">No profile data yet.</p>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">Schedules</h2>
          <div className="mt-3 space-y-2">
            {schedules.map((s) => (
              <div key={s._id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium capitalize">{s.cadence}</p>
                  <p className="text-xs text-muted">
                    {s.time} · {s.timezone}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Badge label={s.active ? "Active" : "Paused"} tone={s.active ? "success" : "neutral"} />
                  <Badge label={s.requireApproval ? "Manual approve" : "Autonomous"} tone={s.requireApproval ? "warning" : "brand"} />
                </div>
              </div>
            ))}
            {schedules.length === 0 ? <p className="text-sm text-muted">No schedule set up.</p> : null}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-sm font-semibold">Connected accounts</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {socialAccounts.map((a) => (
            <Badge key={a._id} label={`${a.platform} · ${a.status}`} tone={a.status === "active" ? "success" : "danger"} />
          ))}
          {socialAccounts.length === 0 ? <p className="text-sm text-muted">No accounts connected.</p> : null}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-sm font-semibold">Post breakdown</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(postCounts).map(([status, count]) => (
            <Badge key={status} label={`${status}: ${count}`} tone={statusTone[status] ?? "neutral"} />
          ))}
          {Object.keys(postCounts).length === 0 ? (
            <p className="text-sm text-muted">
              <Ban className="mr-1 inline h-3.5 w-3.5" />
              No posts yet.
            </p>
          ) : null}
        </div>
      </Card>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Recent posts</h2>
        <Table>
          <Thead>
            <Tr>
              <Th>Content</Th>
              <Th>Platform</Th>
              <Th>Status</Th>
              <Th>Risk</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {recentPosts.map((post) => (
              <Tr key={post._id}>
                <Td className="max-w-md truncate">{post.content}</Td>
                <Td className="capitalize">{post.platform}</Td>
                <Td>
                  <Badge label={post.status} tone={statusTone[post.status]} />
                </Td>
                <Td>
                  {post.safetyReview ? (
                    <Badge label={post.safetyReview.riskLevel} tone={riskTone[post.safetyReview.riskLevel]} />
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </Td>
                <Td className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
            {recentPosts.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="text-center text-muted">
                  No posts yet.
                </Td>
              </Tr>
            ) : null}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
