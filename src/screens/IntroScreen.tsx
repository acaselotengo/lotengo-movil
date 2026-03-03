import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const INTRO_DURATION_MS = 1000;

const INTRO_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/lotengo-app-7a801.firebasestorage.app/o/intro.png?alt=media&token=a83e2a1e-6278-4971-8c5e-8229e5657ef2";

type IntroScreenProps = {
  onFinish: () => void;
};

export default function IntroScreen({ onFinish }: IntroScreenProps) {
  useEffect(() => {
    const t = setTimeout(onFinish, INTRO_DURATION_MS);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: INTRO_IMAGE_URL }}
        style={styles.image}
        resizeMode="cover"
        accessible
        accessibilityLabel="Lo Tengo - Pantalla de introducción"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});
