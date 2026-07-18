import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Card, AppText, Badge, Button, PlatformIcon } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { listPlans, selectPlan, SubscriptionPlan } from "@/api/subscription";

export default function BillingScreen() {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    listPlans()
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  function onSubscribe(plan: SubscriptionPlan) {
    Alert.alert(
      "Payment isn't live yet",
      `Card payment for the ${plan.name} plan isn't wired up in this build. Use "Activate for testing" below to try it out without paying.`
    );
  }

  async function onActivateForTesting(plan: SubscriptionPlan) {
    setSelectingId(plan._id);
    try {
      await selectPlan(plan._id);
      await refreshUser();
    } finally {
      setSelectingId(null);
    }
  }

  const currentCadence = user?.subscription?.cadence;

  return (
    <ScreenContainer scroll>
      <View className="pt-4 pb-2">
        <Heading>Billing &amp; plan</Heading>
        <Muted className="mt-1">Your plan is based on how often you want new posts.</Muted>
      </View>

      <Card className="mt-4 bg-brand-500" style={{ shadowOpacity: 0 }}>
        <AppText weight="medium" className="text-brand-100">
          Current plan
        </AppText>
        <AppText weight="bold" className="mt-1 text-xl text-white capitalize">
          {currentCadence ? `${currentCadence} posting` : "No plan selected"}
        </AppText>
        <Badge
          label={user?.subscription?.status ?? "none"}
          tone={user?.subscription?.status === "active" || user?.subscription?.status === "trialing" ? "success" : "neutral"}
        />
      </Card>

      <View className="mt-2 flex-row items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
        <FontAwesome6 name="circle-info" size={13} color="#94a3b8" style={{ marginTop: 2 }} />
        <Muted className="flex-1 text-xs">
          Card payment isn't live in this build yet. "Subscribe" will explain that once tapped — use "Activate for
          testing" to try a plan without paying.
        </Muted>
      </View>

      <AppText weight="semibold" className="mb-2 mt-6 text-base">
        Available plans
      </AppText>
      <View className="gap-3">
        {plans.map((plan) => {
          const isCurrent = user?.subscription?.planId === plan._id;
          return (
            <Card key={plan._id} className={isCurrent ? "border-2 border-brand-500" : ""}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center gap-2">
                    <AppText weight="semibold" className="text-base">
                      {plan.name}
                    </AppText>
                    {isCurrent ? <Badge label="Current" tone="brand" /> : null}
                  </View>
                  <Muted className="mt-0.5 capitalize">{plan.cadence} posting · {plan.postsPerCycle} posts/cycle</Muted>
                </View>
                <AppText weight="bold" className="text-lg">
                  ${plan.price}
                  <AppText className="text-xs text-slate-400">/mo</AppText>
                </AppText>
              </View>

              <View className="mt-3 flex-row flex-wrap gap-1.5">
                {plan.platformsIncluded.map((p) => (
                  <PlatformIcon key={p} platform={p} size={13} />
                ))}
              </View>

              {!isCurrent ? (
                <View className="mt-3 gap-2">
                  <Button label="Subscribe" size="md" onPress={() => onSubscribe(plan)} />
                  <Button
                    label="Activate for testing (skip payment)"
                    variant="ghost"
                    size="md"
                    loading={selectingId === plan._id}
                    icon={<FontAwesome6 name="flask" size={12} color="#64748b" />}
                    onPress={() => onActivateForTesting(plan)}
                  />
                </View>
              ) : null}
            </Card>
          );
        })}

        {!loading && plans.length === 0 ? (
          <Card>
            <Muted>No plans available yet.</Muted>
          </Card>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
