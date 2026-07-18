"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listAllPosts } from "@/lib/adminApi";
import { Post } from "@/types";

export default function AgentActivityPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    listAllPosts().then(setPosts);
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">Agent activity</h1>
      <p className="mt-1 text-sm text-muted">
        Every post below was produced by the AI service&rsquo;s ideation and content agents.
      </p>

      <div className="mt-6 space-y-2">
        {posts.map((post) => (
          <Card key={post._id} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{post.content}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge label={post.platform} tone="brand" />
                <span className="text-xs text-muted">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}
        {posts.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">No agent activity yet.</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
