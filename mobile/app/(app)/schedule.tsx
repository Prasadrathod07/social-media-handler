import { useCallback, useState } from "react";
import { Switch, View, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Card, AppText, Badge, PlatformIcon } from "@/components";
import { listSchedules, updateSchedule } from "@/api/schedules";
import { Schedule } from "@/types";

const cadenceLabel: Record<Schedule["cadence"], string> = {
  daily: "Every day",
  weekly: "Every week",
  monthly: "Every month",
};

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setSchedules(await listSchedules());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function toggleAutoPublish(schedule: Schedule) {
    const updated = await updateSchedule(schedule._id, { autoPublish: !schedule.autoPublish });
    setSchedules((prev) => prev.map((s) => (s._id === schedule._id ? updated : s)));
  }

  async function toggleActive(schedule: Schedule) {
    const updated = await updateSchedule(schedule._id, { active: !schedule.active });
    setSchedules((prev) => prev.map((s) => (s._id === schedule._id ? updated : s)));
  }

  return (
    <ScreenContainer scroll refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <View className="pt-4 pb-2">
        <Heading>Schedule</Heading>
        <Muted className="mt-1">Control when and how your posts go out.</Muted>
      </View>

      <View className="mt-4 gap-3">
        {schedules.map((s) => (
          <Card key={s._id}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40">
                  <FontAwesome6 name="calendar-days" size={14} color="#6a3bff" />
                </View>
                <View>
                  <AppText weight="semibold">{cadenceLabel[s.cadence]}</AppText>
                  <Muted className="text-xs">
                    {s.time} · {s.timezone}
                  </Muted>
                </View>
              </View>
              <Badge label={s.active ? "Active" : "Paused"} tone={s.active ? "success" : "neutral"} />
            </View>

            <View className="mt-3 flex-row gap-2">
              {s.platforms.map((p) => (
                <PlatformIcon key={p} platform={p} size={14} />
              ))}
            </View>

            <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <AppText className="text-sm">Auto-publish (skip approval)</AppText>
              <Switch value={s.autoPublish} onValueChange={() => toggleAutoPublish(s)} trackColor={{ true: "#6a3bff" }} />
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <AppText className="text-sm">Active</AppText>
              <Switch value={s.active} onValueChange={() => toggleActive(s)} trackColor={{ true: "#6a3bff" }} />
            </View>
          </Card>
        ))}

        {!loading && schedules.length === 0 ? (
          <Card>
            <Muted>No schedule set up yet. Finish onboarding to create one.</Muted>
          </Card>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
