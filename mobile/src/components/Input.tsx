import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { AppText } from "./Text";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="w-full">
      {label ? (
        <AppText weight="medium" className="mb-1.5 text-sm text-slate-700 dark:text-slate-300">
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor="#94a3b8"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={`rounded-xl border bg-slate-50 px-4 py-3.5 text-[15px] text-slate-900 dark:bg-slate-900 dark:text-slate-50 ${
          error
            ? "border-danger"
            : focused
              ? "border-brand-500"
              : "border-slate-200 dark:border-slate-800"
        } ${className ?? ""}`}
        {...rest}
      />
      {error ? (
        <AppText className="mt-1 text-xs text-danger">{error}</AppText>
      ) : helperText ? (
        <AppText className="mt-1 text-xs text-slate-400">{helperText}</AppText>
      ) : null}
    </View>
  );
}
