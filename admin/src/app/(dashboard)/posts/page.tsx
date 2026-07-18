"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { listAllPosts } from "@/lib/adminApi";
import { Post, RiskLevel } from "@/types";

const statuses = ["all", "pendingApproval", "approved", "scheduled", "published", "failed"] as const;

const statusTone: Record<Post["status"], "warning" | "success" | "brand" | "danger" | "neutral"> = {
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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<(typeof statuses)[number]>("all");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    listAllPosts(filter === "all" ? undefined : filter).then((data) => {
      if (cancelled) return;
      setPosts(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const visiblePosts = flaggedOnly
    ? posts.filter((p) => p.safetyReview && p.safetyReview.riskLevel !== "low")
    : posts;

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Post moderation</h1>
      <p className="mt-1 text-sm text-muted">All posts generated across the platform.</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === s
                ? "bg-brand-500 text-white"
                : "bg-black/5 text-foreground/70 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={() => setFlaggedOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            flaggedOnly
              ? "bg-danger text-white"
              : "bg-black/5 text-foreground/70 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          Flagged only
        </button>
      </div>

      <div className="mt-5">
        <Table>
          <Thead>
            <Tr>
              <Th>Content</Th>
              <Th>User</Th>
              <Th>Platform</Th>
              <Th>Status</Th>
              <Th>Safety review</Th>
              <Th>Decided by</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {visiblePosts.map((post) => (
              <Tr key={post._id}>
                <Td className="max-w-md truncate">{post.content}</Td>
                <Td className="text-muted">{typeof post.userId === "object" ? post.userId.email : post.userId}</Td>
                <Td className="capitalize">{post.platform}</Td>
                <Td>
                  <Badge label={post.status} tone={statusTone[post.status]} />
                </Td>
                <Td>
                  {post.safetyReview ? (
                    <Badge label={`${post.safetyReview.riskLevel} risk`} tone={riskTone[post.safetyReview.riskLevel]} />
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </Td>
                <Td>
                  {post.decidedBy ? (
                    <Badge label={post.decidedBy === "ai" ? "AI" : "Human"} tone={post.decidedBy === "ai" ? "brand" : "neutral"} />
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </Td>
                <Td className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
            {!loading && visiblePosts.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="text-center text-muted">
                  No posts found.
                </Td>
              </Tr>
            ) : null}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
