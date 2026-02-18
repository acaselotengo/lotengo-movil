import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1" style={styles.card}>
      <Text className="text-2xl font-bold text-primary" style={color ? { color } : undefined}>
        {value}
      </Text>
      <Text className="text-xs text-text-secondary mt-1 font-medium">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
