import { useColorScheme } from "react-native";

export const brand = {
  50: "#f2f0ff",
  100: "#e6e1ff",
  200: "#cabdff",
  300: "#a892ff",
  400: "#8563ff",
  500: "#6a3bff",
  600: "#5522eb",
  700: "#4419bd",
  800: "#361897",
  900: "#2c1774",
};

export const accent = {
  success: "#1fb87d",
  warning: "#f5a524",
  danger: "#f24e5c",
};

/** Raw hex values for props that can't take a className (icon `color`, StatusBar, charts). */
export function useIconColors() {
  const isDark = useColorScheme() === "dark";
  return {
    isDark,
    ink: isDark ? "#f1f5f9" : "#0f172a",
    muted: isDark ? "#94a3b8" : "#64748b",
    brand: brand[500],
  };
}

export const platformMeta: Record<
  "linkedin" | "x" | "instagram" | "facebook" | "blog",
  { label: string; color: string }
> = {
  linkedin: { label: "LinkedIn", color: "#0a66c2" },
  x: { label: "X", color: "#0f1419" },
  instagram: { label: "Instagram", color: "#d6249f" },
  facebook: { label: "Facebook", color: "#1877f2" },
  blog: { label: "Blog", color: "#6a3bff" },
};
