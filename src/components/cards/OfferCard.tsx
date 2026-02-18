import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Offer } from "../../types";
import {
  formatCOP,
  formatEta,
  getOfferStatusLabel,
  getOfferStatusColor,
} from "../../utils/helpers";
import { getUserById } from "../../services/authService";
import RatingStars from "../ui/RatingStars";
import StatusBadge from "../ui/StatusBadge";

interface OfferCardProps {
  offer: Offer;
  onAccept?: () => void;
  showActions?: boolean;
  index?: number;
}

export default React.memo(
  function OfferCard({
    offer,
    onAccept,
    showActions = false,
    index = 0,
  }: OfferCardProps) {
    const seller = getUserById(offer.sellerId);
    const { bg: statusBg, text: statusText } = getOfferStatusColor(offer.status);

    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(400).springify()}>
        <View className="bg-white rounded-2xl p-4 mb-3" style={styles.card}>
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={18} color="#ad3020" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-text-primary">
                  {seller?.name || "Vendedor"}
                </Text>
                {seller && seller.ratingCount > 0 && (
                  <View className="flex-row items-center mt-0.5">
                    <RatingStars rating={seller.ratingAvg} size={12} />
                    <Text className="text-xs text-text-muted ml-1">
                      ({seller.ratingAvg.toFixed(1)})
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <StatusBadge label={getOfferStatusLabel(offer.status)} bg={statusBg} text={statusText} />
          </View>

          <View className="bg-surface-tertiary rounded-xl p-3 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-2">
                <Ionicons name="cash-outline" size={16} color="#ad3020" />
              </View>
              <Text className="text-lg font-bold text-primary">
                {formatCOP(offer.price)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-accent/10 rounded-full items-center justify-center mr-2">
                <Ionicons name="time-outline" size={16} color="#ef741c" />
              </View>
              <Text className="text-sm font-semibold text-text-secondary">
                {formatEta(offer.etaValue, offer.etaUnit)}
              </Text>
            </View>
          </View>

          {offer.notes && (
            <Text className="text-sm text-text-secondary mt-3 leading-5" numberOfLines={2}>
              {offer.notes}
            </Text>
          )}

          {showActions && offer.status === "SUBMITTED" && onAccept && (
            <TouchableOpacity
              onPress={onAccept}
              className="bg-success rounded-xl py-3 mt-3 items-center flex-row justify-center"
              style={styles.acceptBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text className="text-white font-bold ml-2">Aceptar oferta</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  },
  (prev, next) =>
    prev.offer.id === next.offer.id &&
    prev.offer.status === next.offer.status &&
    prev.showActions === next.showActions
);

const styles = StyleSheet.create({
  card: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  acceptBtn: {
    shadowColor: "#3a7558",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
});
