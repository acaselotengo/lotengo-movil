import { ChatScreenProps } from "../../types/navigation";
import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AppHeader from "../../components/ui/AppHeader";
import ChatBubble from "../../components/chat/ChatBubble";
import ImageViewer from "../../components/chat/ImageViewer";
import { useAuthStore } from "../../store/authStore";
import { getChatById, getMessages, sendMessage } from "../../services/chatService";
import { getUserById } from "../../services/authService";
import { Message, Chat } from "../../types";

export default function ChatScreen({ route }: ChatScreenProps) {
  const { chatId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [chat, setChat] = useState<Chat | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const reload = useCallback(() => {
    setChat(getChatById(chatId));
    setMessages(getMessages(chatId));
  }, [chatId]);

  useFocusEffect(
    useCallback(() => {
      reload();
      const interval = setInterval(reload, 5000);
      return () => clearInterval(interval);
    }, [reload])
  );

  const otherUserId = chat
    ? chat.buyerId === user?.id
      ? chat.sellerId
      : chat.buyerId
    : null;
  const otherUser = otherUserId ? getUserById(otherUserId) : null;

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    await sendMessage(chatId, user.id, "text", { text: text.trim() });
    setText("");
    reload();
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handlePickImage = async () => {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      await sendMessage(chatId, user.id, "image", { uri: result.assets[0].uri });
      reload();
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bg-light"
      keyboardVerticalOffset={0}
    >
      <AppHeader title={otherUser?.name || "Chat"} showBack />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            isOwn={item.senderId === user?.id}
            onImagePress={(uri) => setViewerUri(uri)}
          />
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {/* Input */}
      <View className="flex-row items-end px-3 py-2 bg-white border-t border-border-light">
        <TouchableOpacity
          onPress={handlePickImage}
          className="p-2 mr-1"
        >
          <Ionicons name="image-outline" size={24} color="#33559a" />
        </TouchableOpacity>
        <View className="flex-1 bg-surface-tertiary rounded-2xl px-4 py-2 mr-2 max-h-24">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#8694b8"
            multiline
            className="text-text-primary text-base"
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          className="bg-primary w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ImageViewer uri={viewerUri} onClose={() => setViewerUri(null)} />
    </KeyboardAvoidingView>
  );
}
