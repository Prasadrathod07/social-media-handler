import { useState } from "react";
import { Switch, View } from "react-native";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Button, StepDots, Card, AppText } from "@/components";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthStore } from "@/store/authStore";
import { upsertMyProfile } from "@/api/profile";
import { createSchedule } from "@/api/schedules";
import { completeOnboarding } from "@/api/auth";
import { Cadence } from "@/types";

const cadenceOptions: { id: Cadence; title: string; body: string; badge: string }[] = [
  { id: "daily", title: "Daily", body: "A fresh post every day. Best for building momentum fast.", badge: "Premium plan" },
  { id: "weekly", title: "Weekly", body: "One strong post a week. Our most popular cadence.", badge: "Standard plan" },
  { id: "monthly", title: "Monthly", body: "A monthly highlight post. Light touch, low effort.", badge: "Starter plan" },
];

export default function ScheduleSetupScreen() {
  const { resumeText, bio, aboutMe, cadence, time, requireApproval, setField } = useOnboardingStore();
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function finish() {
    setSubmitting(true);
    setError(undefined);
    try {
      await upsertMyProfile({ resumeText, bio, aboutMe });
      await createSchedule({
        cadence,
        time,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
        requireApproval,
        platforms: ["linkedin"],
        active: true,
      });
      await completeOnboarding();
      await refreshUser();
      router.replace("/(app)");
    } catch {
      setError("Couldn't save your setup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <View className="flex-1 py-6">
        <StepDots total={4} current={3} />
        <Heading className="mt-5">Choose your posting cadence</Heading>
        <Muted className="mt-1.5 mb-6">This decides your plan and how often we generate content.</Muted>

        <View className="gap-3">
          {cadenceOptions.map((opt) => {
            const selected = cadence === opt.id;
            return (
              <Card
                key={opt.id}
                onTouchEnd={() => setField("cadence", opt.id)}
                className={selected ? "border-2 border-brand-500" : ""}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <View className="flex-row items-center gap-2">
                      <AppText weight="semibold" className="text-base">
                        {opt.title}
                      </AppText>
                      <View className="rounded-full bg-brand-50 px-2 py-0.5 dark:bg-brand-900/40">
                        <AppText weight="medium" className="text-[11px] text-brand-700 dark:text-brand-200">
                          {opt.badge}
                        </AppText>
                      </View>
                    </View>
                    <Muted className="mt-1">{opt.body}</Muted>
                  </View>
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selected ? "border-brand-500 bg-brand-500" : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {selected ? <FontAwesome6 name="check" size={11} color="#fff" /> : null}
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <Card className="mt-4 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <AppText weight="medium" className="text-sm">
              Require my approval on every post
            </AppText>
            <Muted className="mt-0.5 text-xs">
              {requireApproval
                ? "You'll review every post before it's ready to go out."
                : "Clean, low-risk posts go out on their own. Anything our AI flags still waits for you."}
            </Muted>
          </View>
          <Switch
            value={requireApproval}
            onValueChange={(v) => setField("requireApproval", v)}
            trackColor={{ true: "#6a3bff" }}
          />
        </Card>

        {error ? <AppText className="mt-4 text-sm text-danger">{error}</AppText> : null}
      </View>

      <View className="pb-4">
        <Button label="Finish setup" onPress={finish} loading={submitting} />
      </View>
    </ScreenContainer>
  );
}
