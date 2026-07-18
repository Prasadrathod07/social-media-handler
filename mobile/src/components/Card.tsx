import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ padded = true, className, style, children, ...rest }: CardProps) {
  return (
    <View
      className={`rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 ${
        padded ? "p-4" : ""
      } ${className ?? ""}`}
      style={[{ shadowColor: "#14121f", shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
