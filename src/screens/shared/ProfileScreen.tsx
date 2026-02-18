import { BuyerProfileScreenProps } from "../../types/navigation";
import React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import AppHeader from "../../components/ui/AppHeader";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";
import RatingStars from "../../components/ui/RatingStars";
import StatCard from "../../components/ui/StatCard";
import BrandLogo from "../../components/BrandLogo";
import { useAuthStore } from "../../store/authStore";
import { resetDb } from "../../db/mockDb";
import { getUserById } from "../../services/authService";

export default function ProfileScreen({ navigation }: BuyerProfileScreenProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const freshUser = user ? getUserById(user.id) : null;
  const displayUser = freshUser || user;

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar" },
      { text: "Cerrar sesión", onPress: () => logout(), style: "destructive" },
    ]);
  };

  const handleResetDb = () => {
    Alert.alert(
      "Reiniciar datos",
      "Esto restablecerá todos los datos a los valores iniciales. ¿Continuar?",
      [
        { text: "Cancelar" },
        {
          text: "Reiniciar",
          onPress: async () => {
            await resetDb();
            await logout();
          },
          style: "destructive",
        },
      ]
    );
  };

  if (!displayUser) return null;

  const isSeller = displayUser.role === "seller";

  return (
    <View className="flex-1 bg-bg-light">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile header with gradient */}
        <LinearGradient
          colors={isSeller ? ["#ef741c", "#f2a515"] : ["#ad3020", "#e14924"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pt-6 pb-16 rounded-b-3xl"
        >
          <Animated.View entering={FadeIn.duration(500)} className="items-center">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-3" style={styles.avatar}>
              <Ionicons name="person" size={36} color="#fff" />
            </View>
            <Text className="text-2xl font-bold text-white">{displayUser.name}</Text>
            <View className="bg-white/20 rounded-full px-4 py-1 mt-2">
              <Text className="text-sm text-white font-medium">
                {isSeller ? "Vendedor" : "Comprador"}
              </Text>
            </View>
            <Text className="text-sm text-white/70 mt-1">{displayUser.email}</Text>

            {displayUser.ratingCount > 0 && (
              <View className="flex-row items-center mt-3">
                <RatingStars rating={displayUser.ratingAvg} size={18} />
                <Text className="text-sm text-white/80 ml-2">
                  {displayUser.ratingAvg.toFixed(1)} ({displayUser.ratingCount})
                </Text>
              </View>
            )}
          </Animated.View>
        </LinearGradient>

        {/* Stats overlapping */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-4 -mt-8">
          <View className="flex-row">
            <StatCard
              value={displayUser.ratingAvg ? displayUser.ratingAvg.toFixed(1) : "N/A"}
              label="Rating"
              color={isSeller ? "#ef741c" : "#ad3020"}
            />
            <StatCard
              value={displayUser.ratingCount}
              label="Reseñas"
              color={isSeller ? "#ef741c" : "#ad3020"}
            />
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="px-4 mt-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
            className="bg-white flex-row items-center px-4 py-4 rounded-2xl mb-2"
            style={styles.actionCard}
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Ionicons name="lock-closed-outline" size={18} color="#ad3020" />
            </View>
            <Text className="text-text-primary text-base font-medium flex-1">Cambiar contraseña</Text>
            <Ionicons name="chevron-forward" size={18} color="#dbe1ef" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResetDb}
            className="bg-white flex-row items-center px-4 py-4 rounded-2xl mb-2"
            style={styles.actionCard}
          >
            <View className="w-10 h-10 bg-warning-light rounded-full items-center justify-center mr-3">
              <Ionicons name="refresh-outline" size={18} color="#f2a515" />
            </View>
            <Text className="text-text-primary text-base font-medium flex-1">Reiniciar datos (demo)</Text>
            <Ionicons name="chevron-forward" size={18} color="#dbe1ef" />
          </TouchableOpacity>

          {/* About section with logo */}
          <View className="bg-white rounded-2xl px-4 py-4 mb-2 items-center" style={styles.actionCard}>
            <BrandLogo size={120} accessibilityLabel="LO TENGO" />
            <Text className="text-xs text-text-muted mt-1">Versión 1.0.0</Text>
          </View>

          <PrimaryButton
            title="Cerrar sesión"
            onPress={handleLogout}
            variant="danger"
            className="mt-4"
            icon={<Ionicons name="log-out-outline" size={18} color="#fff" />}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionCard: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
