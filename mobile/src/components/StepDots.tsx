import React from "react";
import { View } from "react-native";

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <View className="flex-row gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-1.5 rounded-full ${i === current ? "w-6 bg-brand-500" : "w-1.5 bg-slate-200 dark:bg-slate-700"}`}
        />
      ))}
    </View>
  );
}
