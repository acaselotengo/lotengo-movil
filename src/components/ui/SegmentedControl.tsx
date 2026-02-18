import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export default function SegmentedControl({
  options,
  selected,
  onSelect,
}: SegmentedControlProps) {
  return (
    <View className="flex-row bg-surface-tertiary rounded-2xl p-1.5 mb-4">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(opt)}
          className={`flex-1 py-2.5 rounded-xl items-center ${
            selected === opt ? "bg-white" : ""
          }`}
          style={selected === opt ? styles.active : undefined}
        >
          <Text
            className={`text-sm font-semibold ${
              selected === opt ? "text-primary" : "text-text-muted"
            }`}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
