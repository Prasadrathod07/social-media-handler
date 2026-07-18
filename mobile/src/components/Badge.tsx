import React from "react";
import { View } from "react-native";
import { AppText } from "./Text";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

const toneStyles: Record<Tone, { container: string; text: string }> = {
  neutral: { container: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300" },
  brand: { container: "bg-brand-50 dark:bg-brand-900/40", text: "text-brand-700 dark:text-brand-200" },
  success: { container: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300" },
  warning: { container: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  danger: { container: "bg-red-50 dark:bg-red-900/30", text: "text-red-600 dark:text-red-300" },
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  const styles = toneStyles[tone];
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${styles.container}`}>
      <AppText weight="medium" className={`text-xs ${styles.text}`}>
        {label}
      </AppText>
    </View>
  );
}
