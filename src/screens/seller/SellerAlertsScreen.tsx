import { SellerAlertsScreenProps } from "../../types/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import AppHeader from "../../components/ui/AppHeader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuthStore } from "../../store/authStore";
import { getOpenRequests } from "../../services/requestService";
import { getSellerOfferedRequestIds } from "../../services/offerService";
import {
  formatDate,
  formatDistance,
  calcDistance,
  getStatusLabel,
  getStatusColor,
} from "../../utils/helpers";
import { Request } from "../../types";

type EnrichedRequest = {
  request: Request;
  alreadyOffered: boolean;
  distance: number | null;
  status: { bg: string; text: string };
};

export default function SellerAlertsScreen({ navigation }: SellerAlertsScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState<Request[]>([]);

  useFocusEffect(
    useCallback(() => {
      setRequests(getOpenRequests());
    }, [])
  );

  const enrichedRequests = useMemo(() => {
    const offeredSet = user ? getSellerOfferedRequestIds(user.id) : new Set<string>();
    return requests.map((req) => ({
      request: req,
      alreadyOffered: offeredSet.has(req.id),
      distance:
        user?.location && req.location
          ? calcDistance(user.location, req.location)
          : null,
      status: getStatusColor(req.status),
    }));
  }, [requests, user?.id]);

  const renderItem = useCallback(
    ({ item, index }: { item: EnrichedRequest; index: number }) => {
      const { request: req, alreadyOffered, distance, status: { bg: statusBg, text: statusText } } = item;
      return (
        <Animated.View entering={FadeInDown.delay(index * 60).duration(400).springify()}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SellerRequestDetail", { requestId: req.id })
            }
            className="bg-white rounded-2xl p-4 mb-3 flex-row overflow-hidden"
            style={styles.card}
            activeOpacity={0.7}
          >
            <View
              className="w-1 rounded-full mr-3.5"
              style={{ backgroundColor: alreadyOffered ? "#3a7558" : "#ef741c" }}
            />
            <View className="flex-1">
              <View className="flex-row justify-between items-start mb-2">
                <Text
                  className="text-base font-bold text-text-primary flex-1 mr-2"
                  numberOfLines={1}
                >
                  {req.title}
                </Text>
                <StatusBadge label={getStatusLabel(req.status)} bg={statusBg} text={statusText} />
              </View>

              <View className="flex-row items-center mb-1.5">
                <Ionicons name="time-outline" size={13} color="#8694b8" />
                <Text className="text-sm text-text-muted ml-1">
                  {formatDate(req.createdAt)}
                </Text>
                {distance !== null && (
                  <>
                    <Text className="text-text-muted mx-1.5">·</Text>
                    <Ionicons name="location-outline" size={13} color="#8694b8" />
                    <Text className="text-sm text-text-muted ml-0.5">
                      {formatDistance(distance)}
                    </Text>
                  </>
                )}
              </View>

              {req.description && (
                <Text className="text-sm text-text-secondary mb-2" numberOfLines={2}>
                  {req.description}
                </Text>
              )}

              <View className="flex-row items-center justify-between mt-1">
                {alreadyOffered ? (
                  <View className="flex-row items-center bg-success-light rounded-full px-3 py-1">
                    <Ionicons name="checkmark-circle" size={14} color="#3a7558" />
                    <Text className="text-xs text-success ml-1 font-bold">
                      Ya participaste
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center bg-accent/10 rounded-full px-3 py-1">
                    <Ionicons name="flash" size={14} color="#ef741c" />
                    <Text className="text-xs text-accent ml-1 font-bold">
                      Participa!
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center bg-surface-tertiary rounded-full px-3 py-1">
                  <Text className="text-xs text-primary font-semibold mr-0.5">Ver</Text>
                  <Ionicons name="chevron-forward" size={12} color="#ad3020" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [navigation]
  );

  return (
    <View className="flex-1 bg-bg-light">
      <AppHeader title="Solicitudes Disponibles" />
      <FlatList
        className="flex-1 px-4 pt-2"
        data={enrichedRequests}
        keyExtractor={(item) => item.request.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Sin solicitudes abiertas"
            subtitle="Cuando los compradores publiquen solicitudes, aparecerán aquí."
            iconColor="#ef741c"
            iconBgColor="bg-accent/10"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});
