import React from "react";
import { Image, View } from "react-native";
import { AppText } from "./Text";

export function Avatar({ name, uri, size = 40 }: { name: string; uri?: string; size?: number }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (uri) {
    return (
      <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
    );
  }

  return (
    <View
      className="items-center justify-center bg-brand-100 dark:bg-brand-900"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <AppText weight="semibold" className="text-brand-700 dark:text-brand-200" style={{ fontSize: size * 0.38 }}>
        {initials || "?"}
      </AppText>
    </View>
  );
}
