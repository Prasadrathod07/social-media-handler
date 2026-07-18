import { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer, Heading, Muted, Input, Button, AppText } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { ApiRequestError } from "@/api/client";

export default function SignupScreen() {
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(undefined);
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, name.trim());
    } catch (e) {
      setError(e instanceof ApiRequestError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <View className="flex-1 justify-center py-10">
        <View className="mb-10">
          <View className="mb-6 h-14 w-14 items-center justify-center rounded-2xl bg-brand-500">
            <AppText weight="bold" className="text-2xl text-white">
              S
            </AppText>
          </View>
          <Heading>Create your account</Heading>
          <Muted className="mt-1.5">Let AI handle your content calendar.</Muted>
        </View>

        <View className="gap-4">
          <Input label="Full name" placeholder="Jordan Lee" value={name} onChangeText={setName} />
          <Input
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="At least 8 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            helperText="Use 8+ characters."
          />
          {error ? <AppText className="text-sm text-danger">{error}</AppText> : null}
          <Button
            label="Create account"
            onPress={onSubmit}
            loading={loading}
            disabled={!email || !password || !name}
          />
        </View>

        <View className="mt-8 flex-row justify-center">
          <Muted>Already have an account? </Muted>
          <Link href="/(auth)/login">
            <AppText weight="semibold" className="text-brand-600 dark:text-brand-300">
              Sign in
            </AppText>
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}
