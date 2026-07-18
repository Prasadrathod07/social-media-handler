"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, Send, Clock } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { getStats, listAllPosts } from "@/lib/adminApi";
import { PlatformStats, Post } from "@/types";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    getStats().then(setStats);
    listAllPosts().then((posts) => setRecentPosts(posts.slice(0, 6)));
  }, []);

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-muted">Platform-wide activity at a glance.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats?.totalUsers ?? "—"} icon={Users} />
        <StatCard label="Active subscriptions" value={stats?.activeSubscriptions ?? "—"} icon={CreditCard} />
        <StatCard label="Posts published" value={stats?.postsPublished ?? "—"} icon={Send} />
        <StatCard label="Awaiting approval" value={stats?.postsPendingApproval ?? "—"} icon={Clock} />
      </div>

      <h2 className="mt-8 text-lg font-semibold tracking-tight">Recent posts</h2>
      <div className="mt-3 space-y-2">
        {recentPosts.map((post) => (
          <Card key={post._id} className="flex items-center justify-between py-3.5">
            <div className="min-w-0 pr-4">
              <p className="truncate text-sm font-medium">{post.content}</p>
              <p className="mt-0.5 text-xs text-muted capitalize">
                {post.platform} · {typeof post.userId === "object" ? post.userId.email : ""}
              </p>
            </div>
            <span className="whitespace-nowrap text-xs capitalize text-muted">{post.status}</span>
          </Card>
        ))}
        {recentPosts.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">No posts yet.</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
