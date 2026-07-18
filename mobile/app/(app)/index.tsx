import { useCallback, useState } from "react";
import { View, RefreshControl } from "react-native";
import { useFocusEffect, router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Card, AppText, Badge, Button, PlatformIcon } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { listPosts } from "@/api/posts";
import { Post } from "@/types";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const [pending, setPending] = useState<Post[]>([]);
  const [upcoming, setUpcoming] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [pendingApproval, scheduled] = await Promise.all([
        listPosts("pendingApproval"),
        listPosts("scheduled"),
      ]);
      setPending(pendingApproval);
      setUpcoming(scheduled);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const cadence = user?.subscription?.cadence;

  return (
    <ScreenContainer scroll refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <View className="pt-4 pb-2">
        <Muted>Welcome back</Muted>
        <Heading className="mt-0.5">{user?.name ?? "there"}</Heading>
      </View>

      <Card className="mt-4 bg-brand-500 dark:bg-brand-600" style={{ shadowOpacity: 0 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <AppText weight="medium" className="text-brand-100">
              Current plan
            </AppText>
            <AppText weight="bold" className="mt-1 text-xl text-white capitalize">
              {cadence ? `${cadence} posting` : "No plan yet"}
            </AppText>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <FontAwesome6 name="bolt" size={18} color="#fff" />
          </View>
        </View>
      </Card>

      <View className="mt-6 flex-row items-center justify-between">
        <AppText weight="semibold" className="text-base">
          Awaiting your approval
        </AppText>
        {pending.length > 0 ? <Badge label={String(pending.length)} tone="warning" /> : null}
      </View>

      {pending.length === 0 ? (
        <Card className="mt-3">
          <Muted>Nothing waiting on you right now. New drafts will show up here.</Muted>
        </Card>
      ) : (
        <View className="mt-3 gap-2">
          {pending.slice(0, 3).map((post) => (
            <Card key={post._id} onTouchEnd={() => router.push(`/post/${post._id}`)}>
              <View className="flex-row items-center gap-3">
                <PlatformIcon platform={post.platform} size={16} />
                <View className="flex-1">
                  <AppText weight="medium" numberOfLines={2}>
                    {post.content}
                  </AppText>
                </View>
                <FontAwesome6 name="chevron-right" size={13} color="#94a3b8" />
              </View>
            </Card>
          ))}
        </View>
      )}

      <View className="mt-6 flex-row items-center justify-between">
        <AppText weight="semibold" className="text-base">
          Upcoming
        </AppText>
      </View>
      {upcoming.length === 0 ? (
        <Card className="mt-3">
          <Muted>No posts scheduled yet.</Muted>
        </Card>
      ) : (
        <View className="mt-3 gap-2">
          {upcoming.slice(0, 3).map((post) => (
            <Card key={post._id} className="flex-row items-center gap-3">
              <PlatformIcon platform={post.platform} size={16} />
              <View className="flex-1">
                <AppText weight="medium" numberOfLines={1}>
                  {post.content}
                </AppText>
                <Muted className="text-xs">
                  {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : "Not yet scheduled"}
                </Muted>
              </View>
            </Card>
          ))}
        </View>
      )}

      <View className="mt-6 mb-2">
        <Button label="Get new post ideas" icon={<FontAwesome6 name="wand-magic-sparkles" size={14} color="#fff" />} onPress={() => router.push("/(app)/topics")} />
      </View>
    </ScreenContainer>
  );
}
