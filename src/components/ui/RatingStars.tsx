import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export default function RatingStars({
  rating,
  size = 20,
  interactive = false,
  onChange,
}: RatingStarsProps) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        const StarWrapper = interactive ? TouchableOpacity : View;
        return (
          <StarWrapper
            key={star}
            onPress={interactive ? () => onChange?.(star) : undefined}
            className="mr-0.5"
          >
            <Ionicons
              name={filled ? "star" : "star-outline"}
              size={size}
              color={filled ? "#f2a515" : "#dbe1ef"}
            />
          </StarWrapper>
        );
      })}
    </View>
  );
}
