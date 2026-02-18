import React from "react";
import { View, StyleSheet } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "elevated" | "outlined" | "filled";
}

export default function Card({ children, className = "", variant = "elevated" }: CardProps) {
  const variantClasses = {
    elevated: "bg-white rounded-2xl p-4 border border-border-light/50",
    outlined: "bg-white rounded-2xl p-4 border border-border-light",
    filled: "bg-surface-tertiary rounded-2xl p-4",
  };

  return (
    <View
      className={`${variantClasses[variant]} ${className}`}
      style={variant === "elevated" ? styles.elevated : undefined}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  elevated: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});
