import React from "react";
import { Modal, View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImageViewerProps {
  uri: string | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

export default function ImageViewer({ uri, onClose }: ImageViewerProps) {
  if (!uri) return null;

  return (
    <Modal visible={!!uri} transparent animationType="fade">
      <View className="flex-1 bg-black items-center justify-center">
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-14 right-4 z-10 bg-white/20 rounded-full p-2"
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri }}
          style={{ width: width * 0.95, height: height * 0.7 }}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}
