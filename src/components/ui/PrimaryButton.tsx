import React from "react";
import { Text, ActivityIndicator, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "accent" | "outline" | "danger" | "success";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  outline: "bg-white border-2 border-primary",
  danger: "bg-danger",
  success: "bg-success",
};

const textStyles: Record<string, string> = {
  primary: "text-white",
  secondary: "text-white",
  accent: "text-white",
  outline: "text-primary",
  danger: "text-white",
  success: "text-white",
};

const shadowColors: Record<string, string> = {
  primary: "#ad3020",
  secondary: "#33559a",
  accent: "#ef741c",
  danger: "#e14924",
  success: "#3a7558",
  outline: "#ad3020",
};

const sizeStyles: Record<string, string> = {
  sm: "py-2.5 px-4",
  md: "py-3.5 px-6",
  lg: "py-4 px-8",
};

const textSizeStyles: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export default function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  icon,
  size = "md",
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const gesture = Gesture.Tap()
    .enabled(!disabled && !loading)
    .onBegin(() => {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    })
    .onEnd(() => {
      onPress();
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shadowColor = shadowColors[variant] || "#ad3020";

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={`flex-row items-center justify-center rounded-2xl ${sizeStyles[size]} ${variantStyles[variant]} ${
          disabled ? "opacity-50" : ""
        } ${className}`}
        style={[
          animatedStyle,
          variant !== "outline" && {
            shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === "outline" ? "#ad3020" : "#fff"} />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text
              className={`${textSizeStyles[size]} font-bold ${textStyles[variant]} ${icon ? "ml-2" : ""}`}
            >
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
