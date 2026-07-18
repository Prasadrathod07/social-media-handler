import { View } from "react-native";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Button, Card, AppText } from "@/components";

const points = [
  { icon: "wand-magic-sparkles", title: "AI writes for you", body: "Post ideas and copy generated from your resume, bio, and notes." },
  { icon: "calendar-check", title: "You set the cadence", body: "Daily, weekly, or monthly — we handle the schedule." },
  { icon: "circle-check", title: "You stay in control", body: "Approve or edit every post before it goes live." },
] as const;

export default function WelcomeScreen() {
  return (
    <ScreenContainer scroll>
      <View className="flex-1 justify-center py-10">
        <View className="mb-8 h-16 w-16 items-center justify-center rounded-2xl bg-brand-500">
          <AppText weight="bold" className="text-3xl text-white">
            S
          </AppText>
        </View>
        <Heading className="text-3xl">Let's set up your content engine</Heading>
        <Muted className="mt-2 mb-8">A few quick steps and your AI agent will be ready to post.</Muted>

        <View className="gap-3">
          {points.map((p) => (
            <Card key={p.title} className="flex-row items-start gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40">
                <FontAwesome6 name={p.icon} size={16} color="#6a3bff" />
              </View>
              <View className="flex-1">
                <AppText weight="semibold">{p.title}</AppText>
                <Muted className="mt-0.5">{p.body}</Muted>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View className="pb-4">
        <Button label="Get started" onPress={() => router.push("/(onboarding)/profile-setup")} />
      </View>
    </ScreenContainer>
  );
}
