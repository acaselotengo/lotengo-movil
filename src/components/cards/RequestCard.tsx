import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Request } from "../../types";
import { formatDate, getStatusLabel, getStatusColor } from "../../utils/helpers";
import StatusBadge from "../ui/StatusBadge";

interface RequestCardProps {
  request: Request;
  onPress: () => void;
  showOfferCount?: boolean;
  offerCount?: number;
  index?: number;
}

const STATUS_BAR_COLORS: Record<string, string> = {
  OPEN: "#3a7558",      // leaf/success
  NEGOTIATING: "#33559a", // ocean/secondary
  CLOSED: "#f2a515",    // gold/warning
  ACCEPTED: "#549261",  // green
  CANCELLED: "#e14924", // sunset/danger
};

export default React.memo(
  function RequestCard({
    request,
    onPress,
    showOfferCount = true,
    offerCount = 0,
    index = 0,
  }: RequestCardProps) {
    const { bg: statusBg, text: statusText } = getStatusColor(request.status);
    const barColor = STATUS_BAR_COLORS[request.status] || "#8694b8";

    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(400).springify()}>
        <TouchableOpacity
          onPress={onPress}
          className="bg-white rounded-2xl p-4 mb-3 flex-row overflow-hidden"
          style={styles.card}
          activeOpacity={0.7}
        >
          <View className="w-1 rounded-full mr-3.5" style={{ backgroundColor: barColor }} />
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-base font-bold text-text-primary flex-1 mr-2" numberOfLines={1}>
                {request.title}
              </Text>
              <StatusBadge label={getStatusLabel(request.status)} bg={statusBg} text={statusText} />
            </View>

            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={13} color="#8694b8" />
              <Text className="text-sm text-text-muted ml-1">
                {formatDate(request.createdAt)}
              </Text>
              {request.location?.address && (
                <>
                  <Text className="text-text-muted mx-1.5">·</Text>
                  <Ionicons name="location-outline" size={13} color="#8694b8" />
                  <Text className="text-sm text-text-muted ml-0.5" numberOfLines={1}>
                    {request.location.address}
                  </Text>
                </>
              )}
            </View>

            {showOfferCount && (
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
                      offerCount > 0 ? "bg-success-light" : "bg-surface-tertiary"
                    }`}
                  >
                    <Ionicons
                      name={offerCount > 0 ? "pricetag" : "time-outline"}
                      size={12}
                      color={offerCount > 0 ? "#3a7558" : "#8694b8"}
                    />
                  </View>
                  <Text className={`text-sm font-medium ${offerCount > 0 ? "text-success" : "text-text-muted"}`}>
                    {offerCount > 0
                      ? `${offerCount} Oferta${offerCount > 1 ? "s" : ""}`
                      : "Esperando ofertas"}
                  </Text>
                </View>
                <View className="flex-row items-center bg-surface-tertiary rounded-full px-3 py-1">
                  <Text className="text-xs text-primary font-semibold mr-0.5">Ver</Text>
                  <Ionicons name="chevron-forward" size={12} color="#ad3020" />
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
  (prev, next) =>
    prev.request.id === next.request.id &&
    prev.request.status === next.request.status &&
    prev.offerCount === next.offerCount
);

const styles = StyleSheet.create({
  card: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});
