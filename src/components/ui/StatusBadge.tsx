import React from "react";
import { View, Text } from "react-native";

interface StatusBadgeProps {
  label: string;
  bg: string;
  text: string;
  variant?: "pill" | "dot";
  dotColor?: string;
}

export default function StatusBadge({
  label,
  bg,
  text,
  variant = "pill",
  dotColor,
}: StatusBadgeProps) {
  return (
    <View className={`flex-row items-center px-2.5 py-1 rounded-full ${bg}`}>
      {variant === "dot" && dotColor && (
        <View
          className="w-1.5 h-1.5 rounded-full mr-1.5"
          style={{ backgroundColor: dotColor }}
        />
      )}
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
}
