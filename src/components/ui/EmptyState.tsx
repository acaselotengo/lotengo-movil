import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import PrimaryButton from "./PrimaryButton";
import BrandLogo from "../BrandLogo";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconColor?: string;
  iconBgColor?: string;
  showLogo?: boolean;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  iconColor = "#8694b8",
  iconBgColor = "bg-surface-tertiary",
  showLogo = true,
}: EmptyStateProps) {
  return (
    <Animated.View entering={FadeIn.duration(400)} className="items-center py-12 px-8">
      {showLogo && (
        <View className="mb-2 opacity-40">
          <BrandLogo size={100} accessibilityLabel="" />
        </View>
      )}
      <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${iconBgColor}`}>
        <Ionicons name={icon} size={36} color={iconColor} />
      </View>
      <Text className="text-lg font-bold text-text-primary text-center mb-1">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-text-secondary text-center leading-5">{subtitle}</Text>
      )}
      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          className="mt-5"
        />
      )}
    </Animated.View>
  );
}
