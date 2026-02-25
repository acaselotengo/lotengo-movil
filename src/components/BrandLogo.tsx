import React, { memo } from "react";
import { Image, ImageStyle, StyleProp, View } from "react-native";

interface BrandLogoProps {
  size?: number;
  variant?: "full" | "mark";
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
  containerPadding?: number;
}

const logoSource = require("../../assets/logoLotengo.png");

function BrandLogoInner({
  size = 80,
  variant = "full",
  style,
  accessibilityLabel = "LO TENGO",
  containerPadding = 8,
}: BrandLogoProps) {
  return (
    <View
      style={{ padding: containerPadding }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Image
        source={logoSource}
        style={[
          {
            width: size,
            height: variant === "mark" ? size : size * 0.45,
          },
          style,
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

export const BrandLogo = memo(BrandLogoInner);
export default BrandLogo;
