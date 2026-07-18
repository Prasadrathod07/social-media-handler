import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Card, AppText, Badge, Button, Input, PlatformIcon } from "@/components";
import { listPosts, updatePostStatus } from "@/api/posts";
import { Post } from "@/types";

export default function PostReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState<"approve" | "save" | null>(null);

  const load = useCallback(async () => {
    const posts = await listPosts();
    const found = posts.find((p) => p._id === id) ?? null;
    setPost(found);
    setContent(found?.content ?? "");
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function onApprove() {
    if (!post) return;
    setSaving("approve");
    try {
      await updatePostStatus(post._id, { status: "approved", content });
      router.back();
    } finally {
      setSaving(null);
    }
  }

  async function onSaveDraft() {
    if (!post) return;
    setSaving("save");
    try {
      const updated = await updatePostStatus(post._id, { content });
      setPost(updated);
    } finally {
      setSaving(null);
    }
  }

  if (!post) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Muted>Loading post...</Muted>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll padded={false}>
      <View className="px-5 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <PlatformIcon platform={post.platform} />
            <AppText weight="semibold" className="capitalize">
              {post.platform}
            </AppText>
          </View>
          <Badge label={post.status} tone={post.status === "published" ? "success" : "warning"} />
        </View>

        <Heading className="mt-4">Review before it goes out</Heading>
        <Muted className="mt-1 mb-5">Edit freely — this is exactly what will be published.</Muted>

        <Card padded={false} className="p-1">
          <Input
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            style={{ minHeight: 220, textAlignVertical: "top", borderWidth: 0, backgroundColor: "transparent" }}
          />
        </Card>

        <View className="mt-3 flex-row items-center gap-2">
          <FontAwesome6 name="circle-info" size={12} color="#94a3b8" />
          <Muted className="text-xs">{content.length} characters</Muted>
        </View>
      </View>

      <View className="mt-6 gap-2 px-5 pb-4">
        <Button label="Approve & schedule" loading={saving === "approve"} onPress={onApprove} />
        <Button label="Save changes" variant="secondary" loading={saving === "save"} onPress={onSaveDraft} />
      </View>
    </ScreenContainer>
  );
}
