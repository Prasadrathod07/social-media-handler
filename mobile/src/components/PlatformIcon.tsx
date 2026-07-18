import React from "react";
import { View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { platformMeta } from "../theme/tokens";

type Platform = keyof typeof platformMeta;

// Brand marks (linkedin, x-twitter, instagram, facebook) aren't in the default
// "regular" style; FontAwesome6's own glyph fallback auto-resolves them to the
// "brand" font family, so no explicit style prop is needed here.
const iconName: Record<Platform, string> = {
  linkedin: "linkedin",
  x: "x-twitter",
  instagram: "instagram",
  facebook: "facebook",
  blog: "rss",
};

export function PlatformIcon({ platform, size = 18 }: { platform: Platform; size?: number }) {
  const meta = platformMeta[platform];
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size * 2, height: size * 2, backgroundColor: `${meta.color}1a` }}
    >
      <FontAwesome6 name={iconName[platform]} size={size} color={meta.color} />
    </View>
  );
}
