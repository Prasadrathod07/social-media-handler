import { useCallback, useState } from "react";
import { View, RefreshControl } from "react-native";
import { useFocusEffect, router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Card, AppText, Badge, Button, PlatformIcon } from "@/components";
import { listTopics, suggestTopics, updateTopicStatus } from "@/api/topics";
import { generatePost } from "@/api/posts";
import { Topic } from "@/types";

const statusTone: Record<Topic["status"], "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export default function TopicsScreen() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setTopics(await listTopics());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function onSuggest() {
    setSuggesting(true);
    try {
      const created = await suggestTopics("linkedin", 3);
      setTopics((prev) => [...created, ...prev]);
    } finally {
      setSuggesting(false);
    }
  }

  async function onDecide(id: string, status: "approved" | "rejected") {
    const updated = await updateTopicStatus(id, status);
    setTopics((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }

  async function onGenerate(topic: Topic) {
    setGeneratingId(topic._id);
    try {
      const platform = topic.platformTargets[0] ?? "linkedin";
      const post = await generatePost(topic._id, platform);
      router.push(`/post/${post._id}`);
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <ScreenContainer scroll refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <View className="flex-row items-center justify-between pt-4 pb-2">
        <Heading>Topics</Heading>
      </View>
      <Muted className="mb-4">Approve an AI idea or write your own — then generate the post.</Muted>

      <Button
        label={suggesting ? "Thinking of ideas..." : "Suggest new ideas"}
        variant="secondary"
        loading={suggesting}
        icon={!suggesting ? <FontAwesome6 name="wand-magic-sparkles" size={14} color="#5522eb" /> : undefined}
        onPress={onSuggest}
      />

      <View className="mt-5 gap-3">
        {topics.map((topic) => (
          <Card key={topic._id}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <AppText weight="medium">{topic.subjectText}</AppText>
                <View className="mt-2 flex-row items-center gap-2">
                  <Badge label={topic.status} tone={statusTone[topic.status]} />
                  {topic.platformTargets[0] ? <PlatformIcon platform={topic.platformTargets[0]} size={12} /> : null}
                </View>
              </View>
            </View>

            {topic.status === "pending" ? (
              <View className="mt-3 flex-row gap-2">
                <Button label="Reject" variant="ghost" fullWidth={false} size="md" onPress={() => onDecide(topic._id, "rejected")} />
                <Button label="Approve" variant="secondary" fullWidth={false} size="md" onPress={() => onDecide(topic._id, "approved")} />
              </View>
            ) : topic.status === "approved" ? (
              <View className="mt-3">
                <Button
                  label="Generate post"
                  size="md"
                  loading={generatingId === topic._id}
                  onPress={() => onGenerate(topic)}
                />
              </View>
            ) : null}
          </Card>
        ))}

        {!loading && topics.length === 0 ? (
          <Card>
            <Muted>No topics yet. Tap "Suggest new ideas" to get started.</Muted>
          </Card>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
