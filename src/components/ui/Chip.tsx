import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2.5 rounded-full mr-2 mb-2 ${
        selected
          ? "bg-primary"
          : "bg-surface-tertiary"
      }`}
      style={selected ? styles.selected : undefined}
      activeOpacity={0.7}
    >
      <Text
        className={`text-sm font-semibold ${
          selected ? "text-white" : "text-text-secondary"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selected: {
    shadowColor: "#ad3020",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
