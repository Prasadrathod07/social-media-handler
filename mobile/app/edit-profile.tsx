import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer, Heading, Muted, Input, Button, AppText } from "@/components";
import { getMyProfile, upsertMyProfile } from "@/api/profile";

export default function EditProfileScreen() {
  const [aboutMe, setAboutMe] = useState("");
  const [bio, setBio] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        if (profile) {
          setAboutMe(profile.aboutMe ?? "");
          setBio(profile.bio ?? "");
          setResumeText(profile.resumeText ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function onSave() {
    setSaving(true);
    setError(undefined);
    try {
      await upsertMyProfile({ aboutMe, bio, resumeText });
      router.back();
    } catch {
      setError("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Muted>Loading profile...</Muted>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View className="flex-1 py-4">
        <Heading>Your profile</Heading>
        <Muted className="mt-1.5 mb-6">
          This is what every AI-generated post is grounded in — keep it current for better results.
        </Muted>

        <View className="gap-4">
          <Input
            label="About you"
            placeholder="e.g. Product designer focused on fintech, 6 years experience, based in Austin"
            value={aboutMe}
            onChangeText={setAboutMe}
            multiline
            numberOfLines={3}
            style={{ minHeight: 84, textAlignVertical: "top" }}
          />
          <Input
            label="Bio / tone"
            placeholder="How you want to sound — casual, expert, witty, formal..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={2}
            style={{ minHeight: 64, textAlignVertical: "top" }}
          />
          <Input
            label="Resume / background"
            placeholder="Paste your resume text, or a summary of your work history"
            value={resumeText}
            onChangeText={setResumeText}
            multiline
            numberOfLines={6}
            style={{ minHeight: 140, textAlignVertical: "top" }}
          />
        </View>

        {error ? <AppText className="mt-4 text-sm text-danger">{error}</AppText> : null}
      </View>

      <View className="pb-4">
        <Button label="Save changes" onPress={onSave} loading={saving} />
      </View>
    </ScreenContainer>
  );
}
