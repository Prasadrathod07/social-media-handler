import React from "react";
import { ScrollView, ScrollViewProps, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps extends ViewProps {
  scroll?: boolean;
  padded?: boolean;
  refreshControl?: ScrollViewProps["refreshControl"];
}

export function ScreenContainer({
  scroll = false,
  padded = true,
  style,
  children,
  refreshControl,
  ...rest
}: ScreenContainerProps) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={["top", "left", "right"]}>
      <Wrapper
        {...rest}
        className={padded ? "flex-1 px-5" : "flex-1"}
        {...(scroll
          ? { contentContainerStyle: { paddingBottom: 32, flexGrow: 1 }, refreshControl }
          : {})}
        style={style}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}
