import { useCallback, useState } from "react";
import { Switch, View, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Card, AppText, Avatar, Badge, Button, PlatformIcon } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { listSocialAccounts } from "@/api/socialAccounts";
import { setAiPaused as setAiPausedApi } from "@/api/auth";
import { SocialAccount } from "@/types";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingAi, setTogglingAi] = useState(false);

  const load = useCallback(async () => {
    try {
      setAccounts(await listSocialAccounts());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function toggleAiPaused(value: boolean) {
    setTogglingAi(true);
    try {
      await setAiPausedApi(value);
      await refreshUser();
    } finally {
      setTogglingAi(false);
    }
  }

  return (
    <ScreenContainer scroll refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <View className="items-center pb-2 pt-6">
        <Avatar name={user?.name ?? "?"} size={72} />
        <Heading className="mt-3">{user?.name}</Heading>
        <Muted>{user?.email}</Muted>
        {user?.subscription?.cadence ? (
          <View className="mt-2">
            <Badge label={`${user.subscription.cadence} plan`} tone="brand" />
          </View>
        ) : null}
      </View>

      <AppText weight="semibold" className="mb-2 mt-6 text-base">
        AI safety
      </AppText>
      <Card>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <AppText weight="medium">Pause AI generation</AppText>
            <Muted className="mt-0.5 text-xs">
              Stops new topic and post suggestions immediately. Nothing is ever published without your approval
              either way.
            </Muted>
          </View>
          <Switch
            value={user?.aiPaused ?? false}
            onValueChange={toggleAiPaused}
            disabled={togglingAi}
            trackColor={{ true: "#f24e5c" }}
          />
        </View>
        {user?.aiPaused ? (
          <View className="mt-3 flex-row items-center gap-2 rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
            <FontAwesome6 name="pause" size={12} color="#f24e5c" />
            <Muted className="flex-1 text-xs text-danger">AI generation is paused for your account.</Muted>
          </View>
        ) : null}
      </Card>

      <AppText weight="semibold" className="mb-2 mt-6 text-base">
        Connected accounts
      </AppText>
      <View className="gap-2">
        {accounts.map((a) => (
          <Card key={a._id} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <PlatformIcon platform={a.platform} size={15} />
              <View>
                <AppText weight="medium" className="capitalize">
                  {a.platform}
                </AppText>
                <Muted className="text-xs">{a.platformHandle ?? "Connected"}</Muted>
              </View>
            </View>
            <Badge label={a.status} tone={a.status === "active" ? "success" : "danger"} />
          </Card>
        ))}
        {!loading && accounts.length === 0 ? (
          <Card>
            <Muted>No accounts connected yet.</Muted>
          </Card>
        ) : null}
      </View>

      <AppText weight="semibold" className="mb-2 mt-6 text-base">
        Account
      </AppText>
      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <AppText className="text-sm">Subscription</AppText>
          <AppText weight="medium" className="text-sm capitalize">
            {user?.subscription?.status ?? "none"}
          </AppText>
        </View>
      </Card>

      <View className="mt-6 mb-4">
        <Button
          label="Log out"
          variant="danger"
          icon={<FontAwesome6 name="arrow-right-from-bracket" size={14} color="#fff" />}
          onPress={logout}
        />
      </View>
    </ScreenContainer>
  );
}
