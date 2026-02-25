import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: string[];
  onSelect: (value: string) => void;
  error?: string;
  containerClassName?: string;
}

export default function SelectField({
  label,
  placeholder = "Selecciona una opción",
  value,
  options,
  onSelect,
  error,
  containerClassName = "",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className={`mb-3 ${containerClassName}`}>
      {label && (
        <Text
          className={`text-sm font-semibold mb-1.5 text-text-primary`}
        >
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
        className={`rounded-xl px-4 py-3 flex-row items-center justify-between ${
          error
            ? "bg-surface-tertiary border-2 border-danger"
            : "bg-surface-tertiary border border-transparent"
        }`}
      >
        <Text
          className={`text-base ${value ? "text-text-primary" : "text-[#8694b8]"}`}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#8694b8" />
      </TouchableOpacity>
      {error && (
        <Text className="text-danger text-xs mt-1 ml-1">{error}</Text>
      )}

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet} className="bg-white rounded-t-3xl">
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-border-light">
              <Text className="text-base font-bold text-text-primary">
                {label || "Selecciona"}
              </Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#8694b8" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className="px-5 py-4 flex-row items-center justify-between border-b border-border-light"
                  activeOpacity={0.6}
                >
                  <Text className="text-base text-text-primary">{item}</Text>
                  {value === item && (
                    <Ionicons name="checkmark" size={20} color="#ad3020" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "65%",
  },
});
