import { useCallback, useEffect, useState } from "react";
import { RefreshControl, View } from "react-native";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Muted, Card, AppText, Badge, PlatformIcon } from "@/components";
import { listPosts } from "@/api/posts";
import { Post } from "@/types";

const filters = ["all", "pendingApproval", "approved", "scheduled", "published", "failed"] as const;

const statusTone: Record<Post["status"], "warning" | "success" | "brand" | "danger" | "neutral"> = {
  draft: "neutral",
  pendingApproval: "warning",
  approved: "brand",
  scheduled: "brand",
  published: "success",
  failed: "danger",
};

export default function PostHistoryScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (status: (typeof filters)[number]) => {
    setLoading(true);
    try {
      setPosts(await listPosts(status === "all" ? undefined : status));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  return (
    <ScreenContainer scroll refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(filter)} />}>
      <View className="flex-row flex-wrap gap-2 pt-4">
        {filters.map((f) => (
          <AppText
            key={f}
            weight="medium"
            onPress={() => setFilter(f)}
            className={`overflow-hidden rounded-full px-3.5 py-1.5 text-xs capitalize ${
              filter === f
                ? "bg-brand-500 text-white"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {f === "all" ? "All" : f}
          </AppText>
        ))}
      </View>

      <View className="mt-4 gap-2 pb-4">
        {posts.map((post) => (
          <Card key={post._id} onTouchEnd={() => router.push(`/post/${post._id}`)}>
            <View className="flex-row items-start gap-3">
              <PlatformIcon platform={post.platform} size={15} />
              <View className="flex-1">
                <AppText weight="medium" numberOfLines={2}>
                  {post.content}
                </AppText>
                <View className="mt-2 flex-row items-center gap-2">
                  <Badge label={post.status} tone={statusTone[post.status]} />
                  {post.decidedBy === "ai" ? <Badge label="AI decided" tone="brand" /> : null}
                  <Muted className="text-xs">{new Date(post.createdAt).toLocaleDateString()}</Muted>
                </View>
              </View>
              <FontAwesome6 name="chevron-right" size={13} color="#94a3b8" />
            </View>
          </Card>
        ))}

        {!loading && posts.length === 0 ? (
          <Card>
            <Muted>No posts here yet.</Muted>
          </Card>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
