import React, { useCallback, useMemo } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAuthStore } from "../../store/authStore";
import { getRequestsByBuyer } from "../../services/requestService";
import { getOffersByRequest } from "../../services/offerService";
import RequestCard from "../../components/cards/RequestCard";
import EmptyState from "../../components/ui/EmptyState";
import BrandLogo from "../../components/BrandLogo";
import { CATEGORIES } from "../../utils/helpers";
import { Request } from "../../types";
import { BuyerHomeScreenProps } from "../../types/navigation";

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Electrónica: "phone-portrait-outline",
  Comida: "restaurant-outline",
  Servicios: "construct-outline",
  Hogar: "home-outline",
  Moda: "shirt-outline",
  Otro: "ellipsis-horizontal",
};

const categoryColors: Record<string, [string, string]> = {
  Electrónica: ["#33559a", "#489dba"],
  Comida: ["#ef741c", "#f2a515"],
  Servicios: ["#3a7558", "#549261"],
  Hogar: ["#2a2c7c", "#33559a"],
  Moda: ["#e14924", "#ef741c"],
  Otro: ["#8694b8", "#b8c3df"],
};

type EnrichedRequest = { request: Request; offerCount: number };

export default function BuyerHomeScreen({ navigation }: BuyerHomeScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = React.useState<Request[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) setRequests(getRequestsByBuyer(user.id));
    }, [user?.id])
  );

  const activeRequests = useMemo(
    () =>
      requests
        .filter((r) => r.status === "OPEN" || r.status === "NEGOTIATING")
        .map((r) => ({ request: r, offerCount: getOffersByRequest(r.id).length })),
    [requests]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: EnrichedRequest; index: number }) => (
      <View className="px-5">
        <RequestCard
          request={item.request}
          offerCount={item.offerCount}
          onPress={() => navigation.navigate("RequestDetail", { requestId: item.request.id })}
          index={index}
        />
      </View>
    ),
    [navigation]
  );

  const ListHeader = useMemo(
    () => (
      <>
        {/* Header with gradient */}
        <LinearGradient
          colors={["#ad3020", "#e14924"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pt-5 pb-8 rounded-b-3xl"
        >
          <Animated.View entering={FadeIn.duration(500)}>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-3">
                  <Ionicons name="person" size={22} color="#fff" />
                </View>
                <View>
                  <Text className="text-sm text-white/70">Hola de nuevo,</Text>
                  <Text className="text-lg font-bold text-white">{user?.name}</Text>
                </View>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-white/15 rounded-full items-center justify-center">
                <Ionicons name="notifications-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* CTA */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <View className="bg-white/15 rounded-2xl p-4">
              <Text className="text-lg font-bold text-white mb-1">
                ¿Necesitas algo?
              </Text>
              <Text className="text-sm text-white/80 mb-3">
                Publica una solicitud y deja que los vendedores te encuentren.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateRequest")}
                className="bg-white self-start flex-row items-center rounded-xl px-4 py-2.5"
                style={styles.ctaButton}
              >
                <Ionicons name="add-circle" size={18} color="#ad3020" />
                <Text className="text-sm font-bold text-primary ml-2">
                  Nueva Solicitud
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>

        <View className="px-5 mt-6">
          {/* Categories */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Text className="text-base font-bold text-text-primary mb-3">
              Explorar Categorías
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              {CATEGORIES.map((cat) => {
                const colors = categoryColors[cat] || ["#8694b8", "#b8c3df"];
                return (
                  <View key={cat} className="items-center mr-4">
                    <LinearGradient
                      colors={colors}
                      className="w-14 h-14 rounded-2xl items-center justify-center mb-1.5"
                      style={styles.categoryIcon}
                    >
                      <Ionicons
                        name={categoryIcons[cat] || "grid-outline"}
                        size={22}
                        color="#fff"
                      />
                    </LinearGradient>
                    <Text className="text-xs text-text-secondary font-medium">{cat}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Active requests title */}
          <Text className="text-base font-bold text-text-primary mb-3">
            Tus Solicitudes Activas
          </Text>
        </View>
      </>
    ),
    [user?.name, navigation]
  );

  return (
    <FlatList
      className="flex-1 bg-bg-light"
      data={activeRequests}
      keyExtractor={(item) => item.request.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        <View className="px-5">
          <EmptyState
            icon="document-text-outline"
            title="Sin solicitudes activas"
            subtitle="Crea tu primera solicitud y recibe ofertas de vendedores locales."
            actionLabel="Crear Solicitud"
            onAction={() => navigation.navigate("CreateRequest")}
            iconColor="#ad3020"
            iconBgColor="bg-primary/10"
          />
        </View>
      }
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  ctaButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
