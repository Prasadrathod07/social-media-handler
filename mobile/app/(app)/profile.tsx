import { useCallback, useState } from "react";
import { View, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Card, AppText, Avatar, Badge, Button, PlatformIcon } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { listSocialAccounts } from "@/api/socialAccounts";
import { SocialAccount } from "@/types";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

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
