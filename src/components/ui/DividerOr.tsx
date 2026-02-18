import React from "react";
import { View, Text } from "react-native";

export default function DividerOr() {
  return (
    <View className="flex-row items-center my-4">
      <View className="flex-1 h-px bg-border-light" />
      <Text className="mx-4 text-text-muted text-sm">o</Text>
      <View className="flex-1 h-px bg-border-light" />
    </View>
  );
}
