import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";

const STEPS = [
  "Preparando tu solicitud…",
  "Publicando tu solicitud…",
  "Avisando a los vendedores cercanos…",
] as const;

const TRACK_COLOR = "#e8eaef";
const GRADIENT_START = "#ffffff";
const GRADIENT_END = "#D94B2E";
const CONTAINER_BG = "#f1f3f5";
const TEXT_PRIMARY = "#1a1a1a";

interface PublishRequestLoaderProps {
  visible: boolean;
  step: 1 | 2 | 3;
}

export default function PublishRequestLoader({ visible, step }: PublishRequestLoaderProps) {
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = Math.min(windowWidth - 48, 360);

  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    shimmer.value = 0;
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [visible]);

  const progressTrackStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmer.value, [0, 1], [0, contentWidth - 80]);
    return {
      transform: [{ translateX }],
    };
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.card, { width: contentWidth }]}>
          {/* Etiqueta "Por favor espere" */}
          <View style={styles.tagWrapper}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Por favor espere</Text>
            </View>
          </View>

          {/* Barra de progreso: degradado blanco → color app */}
          <View style={styles.progressOuter}>
            <View style={styles.progressTrack}>
              {/* Relleno por paso: blanco → #D94B2E */}
              <View
                style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]}
                pointerEvents="none"
              >
                <LinearGradient
                  colors={[GRADIENT_START, GRADIENT_END]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </View>
              {/* Brillo animado con el mismo degradado */}
              <Animated.View style={[styles.progressShine, progressTrackStyle]}>
                <LinearGradient
                  colors={[GRADIENT_START, GRADIENT_END]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shineInner}
                />
              </Animated.View>
            </View>
          </View>

          {/* Mensaje de estado */}
          <View style={styles.messageBox}>
            <Text
              style={styles.stepText}
              accessibilityLabel={`Paso ${step} de 3. ${STEPS[step - 1]}`}
              accessibilityLiveRegion="polite"
            >
              {step}. {STEPS[step - 1]}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#2a2c7c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  tagWrapper: {
    position: "absolute",
    top: -10,
    right: 16,
    zIndex: 1,
  },
  tag: {
    backgroundColor: GRADIENT_END,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  progressOuter: {
    backgroundColor: CONTAINER_BG,
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressTrack: {
    height: 10,
    borderRadius: 8,
    backgroundColor: TRACK_COLOR,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressShine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  shineInner: {
    flex: 1,
    width: 40,
    borderRadius: 6,
    shadowColor: GRADIENT_END,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  messageBox: {
    backgroundColor: CONTAINER_BG,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
});
