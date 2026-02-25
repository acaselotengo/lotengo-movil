import { MyOffersScreenProps } from "../../types/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import AppHeader from "../../components/ui/AppHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/authStore";
import { getChatsByUser } from "../../services/chatService";
import { getOffersBySeller } from "../../services/offerService";
import { getDb } from "../../db/mockDb";
import {
  formatCOP,
  formatEta,
  getOfferStatusLabel,
  getOfferStatusColor,
  formatDate,
} from "../../utils/helpers";
import { Offer, Chat } from "../../types";

type EnrichedOffer = {
  offer: Offer;
  requestTitle: string;
  statusBg: string;
  statusText: string;
  chat: Chat | null;
};

export default function MyOffersScreen({ navigation }: MyOffersScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [chatCount, setChatCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setOffers(getOffersBySeller(user.id));
        setChatCount(getChatsByUser(user.id).length);
      }
    }, [user?.id])
  );

  const enrichedOffers = useMemo(() => {
    const db = getDb();
    const requestMap = new Map(db.requests.map((r) => [r.id, r]));
    const chatMap = new Map(db.chats.map((c) => [c.requestId, c]));

    return offers.map((offer) => {
      const { bg: statusBg, text: statusText } = getOfferStatusColor(offer.status);
      return {
        offer,
        requestTitle: requestMap.get(offer.requestId)?.title || "Solicitud",
        statusBg,
        statusText,
        chat: offer.status === "ACCEPTED" ? chatMap.get(offer.requestId) || null : null,
      };
    });
  }, [offers]);

  const renderItem = useCallback(
    ({ item, index }: { item: EnrichedOffer; index: number }) => {
      const { offer, requestTitle, statusBg, statusText, chat } = item;
      return (
        <Animated.View entering={FadeInDown.delay(index * 60).duration(400).springify()}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SellerRequestDetail", {
                requestId: offer.requestId,
              })
            }
            className="bg-white rounded-2xl p-4 mb-3"
            style={styles.card}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-start mb-3">
              <Text
                className="text-base font-bold text-text-primary flex-1 mr-2"
                numberOfLines={1}
              >
                {requestTitle}
              </Text>
              <StatusBadge label={getOfferStatusLabel(offer.status)} bg={statusBg} text={statusText} />
            </View>

            <View className="bg-surface-tertiary rounded-xl p-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="cash-outline" size={16} color="#ad3020" />
                <Text className="text-base font-bold text-primary ml-1.5">
                  {formatCOP(offer.price)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#8694b8" />
                <Text className="text-sm text-text-secondary ml-1">
                  {formatEta(offer.etaValue, offer.etaUnit)}
                </Text>
              </View>
            </View>

            <Text className="text-xs text-text-muted mt-2">
              {formatDate(offer.createdAt)}
            </Text>

            {chat && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Chat", { chatId: chat.id })
                }
                className="flex-row items-center mt-3 pt-3 border-t border-border-light"
              >
                <View className="w-7 h-7 bg-primary/10 rounded-full items-center justify-center mr-2">
                  <Ionicons name="chatbubbles" size={13} color="#ad3020" />
                </View>
                <Text className="text-sm text-primary font-semibold">Ir al Chat</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [navigation]
  );

  const chatAction = (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatsList")}
      className="w-9 h-9 items-center justify-center"
    >
      <Ionicons name="chatbubbles-outline" size={22} color="#ad3020" />
      {chatCount > 0 && (
        <View className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full items-center justify-center">
          <Text className="text-white text-[9px] font-bold">{chatCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-bg-light">
      <AppHeader title="Mis Ofertas" rightAction={chatAction} />
      <FlatList
        className="flex-1 px-4 pt-2"
        data={enrichedOffers}
        keyExtractor={(item) => item.offer.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="pricetags-outline"
            title="Sin ofertas enviadas"
            subtitle="Explora solicitudes abiertas y envía tu primera oferta."
            iconColor="#ad3020"
            iconBgColor="bg-primary/10"
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
