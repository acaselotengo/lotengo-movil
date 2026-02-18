import { ChatsListScreenProps } from "../../types/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import AppHeader from "../../components/ui/AppHeader";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/authStore";
import { getChatsByUser, getLastMessage } from "../../services/chatService";
import { getUserById } from "../../services/authService";
import { getRequestById } from "../../services/requestService";
import { formatDate } from "../../utils/helpers";
import { Chat } from "../../types";

export default function ChatsListScreen({ navigation }: ChatsListScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [chats, setChats] = useState<Chat[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) setChats(getChatsByUser(user.id));
    }, [user?.id])
  );

  const enrichedChats = useMemo(
    () =>
      chats.map((chat) => {
        const otherId = chat.buyerId === user?.id ? chat.sellerId : chat.buyerId;
        return {
          chat,
          otherName: getUserById(otherId)?.name || "Usuario",
          requestTitle: getRequestById(chat.requestId)?.title || "Solicitud",
          lastMsg: getLastMessage(chat.id),
        };
      }),
    [chats, user?.id]
  );

  const renderChat = useCallback(
    ({ item, index }: { item: (typeof enrichedChats)[number]; index: number }) => {
      const { chat, otherName, requestTitle, lastMsg } = item;
      return (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(400).springify()}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
            className="bg-white mx-4 mb-2 px-4 py-3.5 rounded-2xl flex-row items-center"
            style={styles.card}
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={22} color="#ad3020" />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-bold text-text-primary" numberOfLines={1}>
                  {otherName}
                </Text>
                {lastMsg && (
                  <Text className="text-xs text-text-muted">
                    {formatDate(lastMsg.createdAt)}
                  </Text>
                )}
              </View>
              <Text className="text-xs text-primary font-medium mt-0.5" numberOfLines={1}>
                {requestTitle}
              </Text>
              {lastMsg && (
                <Text className="text-sm text-text-muted mt-0.5" numberOfLines={1}>
                  {lastMsg.type === "image" ? "Imagen" : lastMsg.text}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [navigation]
  );

  return (
    <View className="flex-1 bg-bg-light">
      <AppHeader title="Mensajes" />
      {chats.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="Sin conversaciones"
          subtitle="Cuando aceptes una oferta, el chat se creará automáticamente."
          iconColor="#ad3020"
          iconBgColor="bg-primary/10"
        />
      ) : (
        <FlatList
          data={enrichedChats}
          keyExtractor={(item) => item.chat.id}
          renderItem={renderChat}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
