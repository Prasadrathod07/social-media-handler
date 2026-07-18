import React from "react";
import { ActivityIndicator, Pressable, PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AppText } from "./Text";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "children"> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const variantStyles: Record<Variant, { container: string; label: string }> = {
  primary: { container: "bg-brand-500 active:bg-brand-600", label: "text-white" },
  secondary: {
    container: "bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-800",
    label: "text-brand-700 dark:text-brand-200",
  },
  ghost: { container: "bg-transparent", label: "text-slate-700 dark:text-slate-200" },
  danger: { container: "bg-danger active:bg-red-600", label: "text-white" },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
  md: { container: "px-4 py-3", text: "text-[15px]" },
  lg: { container: "px-5 py-4", text: "text-base" },
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  fullWidth = true,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPressIn={(e) => {
        scale.value = withTiming(0.97, { duration: 80 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 120 });
        onPressOut?.(e);
      }}
      className={`flex-row items-center justify-center rounded-xl ${styles.container} ${sizes.container} ${
        fullWidth ? "w-full" : ""
      } ${isDisabled ? "opacity-50" : ""}`}
      style={animatedStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" || variant === "danger" ? "#fff" : "#6a3bff"} />
      ) : (
        <>
          {icon}
          <AppText weight="semibold" className={`${styles.label} ${sizes.text} ${icon ? "ml-2" : ""}`}>
            {label}
          </AppText>
        </>
      )}
    </AnimatedPressable>
  );
}
