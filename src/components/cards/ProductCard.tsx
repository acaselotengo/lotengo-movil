import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Product } from "../../types";
import { formatCOP } from "../../utils/helpers";

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onDelete?: () => void;
  index?: number;
}

export default React.memo(
  function ProductCard({ product, onPress, onDelete, index = 0 }: ProductCardProps) {
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).duration(400).springify()}>
        <TouchableOpacity
          onPress={onPress}
          className="bg-white rounded-2xl overflow-hidden"
          style={styles.card}
          activeOpacity={0.7}
        >
          <View className="h-32 bg-surface-tertiary items-center justify-center">
            {product.images.length > 0 ? (
              <Image
                source={{ uri: product.images[0] }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <View className="w-14 h-14 bg-white rounded-full items-center justify-center">
                  <Ionicons name="image-outline" size={28} color="#dbe1ef" />
                </View>
              </View>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center"
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={14} color="#e14924" />
              </TouchableOpacity>
            )}
          </View>
          <View className="p-3">
            <Text className="text-sm font-bold text-text-primary" numberOfLines={1}>
              {product.name}
            </Text>
            {product.priceBase != null && (
              <Text className="text-sm font-bold text-accent mt-1">
                {formatCOP(product.priceBase)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
  (prev, next) => prev.product.id === next.product.id
);

const styles = StyleSheet.create({
  card: {
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  deleteBtn: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});
