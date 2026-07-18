import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function Index() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  if (status === "checking") return null;
  if (status === "unauthenticated") return <Redirect href="/(auth)/login" />;
  if (!user?.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(app)" />;
}
