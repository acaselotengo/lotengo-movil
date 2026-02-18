import React from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GoogleButtonProps {
  label?: string;
}

export default function GoogleButton({ label = "Continuar con Google" }: GoogleButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => Alert.alert("Google Auth", "Función simulada - No disponible en MVP")}
      className="flex-row items-center justify-center bg-white border border-border-light rounded-xl py-3.5 px-6"
      activeOpacity={0.8}
    >
      <Ionicons name="logo-google" size={20} color="#4285F4" />
      <Text className="text-text-primary text-base font-medium ml-3">{label}</Text>
    </TouchableOpacity>
  );
}
