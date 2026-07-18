"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { listAllPosts } from "@/lib/adminApi";
import { Post } from "@/types";

const statuses = ["all", "pendingApproval", "approved", "scheduled", "published", "failed"] as const;

const statusTone: Record<Post["status"], "warning" | "success" | "brand" | "danger" | "neutral"> = {
  draft: "neutral",
  pendingApproval: "warning",
  approved: "brand",
  scheduled: "brand",
  published: "success",
  failed: "danger",
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<(typeof statuses)[number]>("all");
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

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Post moderation</h1>
      <p className="mt-1 text-sm text-muted">All posts generated across the platform.</p>

      <div className="mt-5 flex flex-wrap gap-2">
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
      </div>

      <div className="mt-5">
        <Table>
          <Thead>
            <Tr>
              <Th>Content</Th>
              <Th>User</Th>
              <Th>Platform</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts.map((post) => (
              <Tr key={post._id}>
                <Td className="max-w-md truncate">{post.content}</Td>
                <Td className="text-muted">{typeof post.userId === "object" ? post.userId.email : post.userId}</Td>
                <Td className="capitalize">{post.platform}</Td>
                <Td>
                  <Badge label={post.status} tone={statusTone[post.status]} />
                </Td>
                <Td className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
            {!loading && posts.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="text-center text-muted">
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
