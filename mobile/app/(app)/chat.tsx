import { useState, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform as RNPlatform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Heading, AppText, Muted, Input, Button } from "@/components";
import { sendMessage } from "@/api/conversations";
import { ChatMessage } from "@/types";

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function onSend() {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");

    const optimistic: ChatMessage = {
      _id: `local-${Date.now()}`,
      conversationId: conversationId ?? "",
      role: "user",
      text,
      imageUrls: [],
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setSending(true);

    try {
      const { conversationId: cid, message } = await sendMessage(text, conversationId);
      setConversationId(cid);
      setMessages((prev) => [...prev, message]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={["top", "left", "right"]}>
      <View className="border-b border-slate-100 px-5 pb-3 pt-2 dark:border-slate-800">
        <Heading>AI Assistant</Heading>
        <Muted className="mt-0.5">Brainstorm, refine, or just talk through your content plan.</Muted>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={RNPlatform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m._id}
          contentContainerStyle={{ padding: 20, gap: 10, flexGrow: 1 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center gap-3 py-10">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/40">
                <FontAwesome6 name="comment-dots" size={18} color="#6a3bff" />
              </View>
              <Muted className="text-center">Ask for post ideas, feedback, or share what's on your mind.</Muted>
            </View>
          }
          renderItem={({ item }) => (
            <View className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              item.role === "user"
                ? "self-end bg-brand-500 rounded-br-sm"
                : "self-start bg-slate-100 dark:bg-slate-800 rounded-bl-sm"
            }`}>
              <AppText className={item.role === "user" ? "text-white" : ""}>{item.text}</AppText>
            </View>
          )}
        />

        <View className="flex-row items-end gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <View className="flex-1">
            <Input
              placeholder="Message your AI assistant..."
              value={draft}
              onChangeText={setDraft}
              multiline
              style={{ maxHeight: 100 }}
            />
          </View>
          <Button
            label=""
            fullWidth={false}
            size="md"
            loading={sending}
            disabled={!draft.trim()}
            onPress={onSend}
            icon={<FontAwesome6 name="paper-plane" size={15} color="#fff" />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
