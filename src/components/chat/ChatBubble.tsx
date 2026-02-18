import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Message } from "../../types";
import { formatTime } from "../../utils/helpers";

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  onImagePress?: (uri: string) => void;
}

export default React.memo(
  function ChatBubble({ message, isOwn, onImagePress }: ChatBubbleProps) {
    const isSystem = message.senderId === "system";

    if (isSystem) {
      return (
        <View className="items-center my-3 px-4">
          <View className="bg-surface-tertiary rounded-full px-5 py-2">
            <Text className="text-xs text-text-secondary text-center font-medium">
              {message.text}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View className={`mb-2.5 px-4 ${isOwn ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isOwn
              ? "bg-primary rounded-br-md"
              : "bg-surface-tertiary rounded-bl-md"
          }`}
          style={isOwn ? styles.ownBubble : styles.otherBubble}
        >
          {message.type === "text" && (
            <Text className={`text-base leading-5 ${isOwn ? "text-white" : "text-text-primary"}`}>
              {message.text}
            </Text>
          )}

          {message.type === "image" && message.uri && (
            <TouchableOpacity onPress={() => onImagePress?.(message.uri!)}>
              <Image
                source={{ uri: message.uri }}
                className="w-48 h-48 rounded-xl"
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

          <Text
            className={`text-xs mt-1.5 ${
              isOwn ? "text-white/60" : "text-text-muted"
            }`}
          >
            {formatTime(message.createdAt)}
          </Text>
        </View>
      </View>
    );
  },
  (prev, next) => prev.message.id === next.message.id && prev.isOwn === next.isOwn
);

const styles = StyleSheet.create({
  ownBubble: {
    shadowColor: "#ad3020",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  otherBubble: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});
