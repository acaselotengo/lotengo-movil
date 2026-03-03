import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export default function AppHeader({ title, showBack = false, rightAction }: AppHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center justify-between px-5 pb-4 bg-white"
      style={[styles.header, { paddingTop: insets.top + 16 }]}
    >
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3 w-9 h-9 rounded-full bg-surface-tertiary items-center justify-center"
          >
            <Ionicons name="chevron-back" size={20} color="#15163e" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-text-primary flex-1" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
