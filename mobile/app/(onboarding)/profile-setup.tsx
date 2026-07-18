import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ScreenContainer, Heading, Muted, Input, Button, StepDots, AppText, Card } from "@/components";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function ProfileSetupScreen() {
  const { resumeText, bio, aboutMe, setField } = useOnboardingStore();
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  async function pickResumeImage() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setResumeFileName(result.assets[0].fileName ?? "resume-photo.jpg");
    }
  }

  return (
    <ScreenContainer scroll>
      <View className="flex-1 py-6">
        <StepDots total={4} current={1} />
        <Heading className="mt-5">Tell us about yourself</Heading>
        <Muted className="mt-1.5 mb-6">
          This grounds every post the AI writes — the more context, the better the fit.
        </Muted>

        <View className="gap-4">
          <Input
            label="About you"
            placeholder="e.g. Product designer focused on fintech, 6 years experience, based in Austin"
            value={aboutMe}
            onChangeText={(t) => setField("aboutMe", t)}
            multiline
            numberOfLines={3}
            style={{ minHeight: 84, textAlignVertical: "top" }}
          />
          <Input
            label="Bio / tone"
            placeholder="How you want to sound — casual, expert, witty, formal..."
            value={bio}
            onChangeText={(t) => setField("bio", t)}
            multiline
            numberOfLines={2}
            style={{ minHeight: 64, textAlignVertical: "top" }}
          />
          <Input
            label="Resume / background (paste text)"
            placeholder="Paste your resume text, or a summary of your work history"
            value={resumeText}
            onChangeText={(t) => setField("resumeText", t)}
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
          />

          <Card className="flex-row items-center justify-between" onTouchEnd={pickResumeImage}>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40">
                <FontAwesome6 name="image" size={16} color="#6a3bff" />
              </View>
              <View>
                <AppText weight="medium">Add a photo instead</AppText>
                <Muted className="text-xs">{resumeFileName ?? "Upload a resume screenshot or photo"}</Muted>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={14} color="#94a3b8" />
          </Card>
        </View>
      </View>

      <View className="gap-2 pb-4">
        <Button label="Continue" onPress={() => router.push("/(onboarding)/connect-accounts")} />
        <Button label="Skip for now" variant="ghost" onPress={() => router.push("/(onboarding)/connect-accounts")} />
      </View>
    </ScreenContainer>
  );
}
