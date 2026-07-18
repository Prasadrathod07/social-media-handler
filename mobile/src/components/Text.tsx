import React from "react";
import { Text as RNText, TextProps } from "react-native";

type Weight = "regular" | "medium" | "semibold" | "bold";

interface AppTextProps extends TextProps {
  weight?: Weight;
}

const weightFont: Record<Weight, string> = {
  regular: "font-sans",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export function AppText({ weight = "regular", className, style, ...rest }: AppTextProps) {
  return <RNText className={`${weightFont[weight]} text-slate-900 dark:text-slate-50 ${className ?? ""}`} style={style} {...rest} />;
}

export function Heading({ className, ...rest }: AppTextProps) {
  return <AppText weight="bold" className={`text-2xl tracking-tight ${className ?? ""}`} {...rest} />;
}

export function Subheading({ className, ...rest }: AppTextProps) {
  return (
    <AppText weight="semibold" className={`text-lg text-slate-700 dark:text-slate-200 ${className ?? ""}`} {...rest} />
  );
}

export function Muted({ className, ...rest }: AppTextProps) {
  return <AppText className={`text-sm text-slate-500 dark:text-slate-400 ${className ?? ""}`} {...rest} />;
}
