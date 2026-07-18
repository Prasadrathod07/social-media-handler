import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as WebBrowser from "expo-web-browser";
import { ScreenContainer, Heading, Muted, Button, StepDots, Card, AppText, Badge, PlatformIcon } from "@/components";
import { Platform } from "@/types";

const platforms: { id: Platform; available: boolean }[] = [
  { id: "linkedin", available: true },
  { id: "x", available: false },
  { id: "instagram", available: false },
  { id: "facebook", available: false },
  { id: "blog", available: false },
];

export default function ConnectAccountsScreen() {
  const [connected, setConnected] = useState<Set<Platform>>(new Set());

  async function connect(id: Platform) {
    if (id !== "linkedin") return;
    // Placeholder OAuth handoff — swap for the real LinkedIn OAuth authorize URL once app credentials are issued.
    await WebBrowser.openBrowserAsync("https://www.linkedin.com/oauth/v2/authorization");
    setConnected((prev) => new Set(prev).add(id));
  }

  return (
    <ScreenContainer scroll>
      <View className="flex-1 py-6">
        <StepDots total={4} current={2} />
        <Heading className="mt-5">Connect your accounts</Heading>
        <Muted className="mt-1.5 mb-6">
          Link the platforms you want us to post to. You can add more anytime.
        </Muted>

        <View className="gap-3">
          {platforms.map((p) => {
            const isConnected = connected.has(p.id);
            return (
              <Card key={p.id} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <PlatformIcon platform={p.id} />
                  <View>
                    <AppText weight="medium" className="capitalize">
                      {p.id === "x" ? "X (Twitter)" : p.id}
                    </AppText>
                    {!p.available ? <Muted className="text-xs">Coming soon</Muted> : null}
                  </View>
                </View>
                {isConnected ? (
                  <Badge label="Connected" tone="success" />
                ) : (
                  <Button
                    label="Connect"
                    variant="secondary"
                    fullWidth={false}
                    size="md"
                    disabled={!p.available}
                    onPress={() => connect(p.id)}
                  />
                )}
              </Card>
            );
          })}
        </View>

        <View className="mt-4 flex-row items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          <FontAwesome6 name="circle-info" size={14} color="#94a3b8" style={{ marginTop: 2 }} />
          <Muted className="flex-1 text-xs">
            LinkedIn is available first. X, Instagram, Facebook, and blog publishing are rolling out next.
          </Muted>
        </View>
      </View>

      <View className="gap-2 pb-4">
        <Button label="Continue" onPress={() => router.push("/(onboarding)/schedule-setup")} />
        <Button label="Skip for now" variant="ghost" onPress={() => router.push("/(onboarding)/schedule-setup")} />
      </View>
    </ScreenContainer>
  );
}
