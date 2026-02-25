import { CreateRequestScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Chip from "../../components/ui/Chip";
import MapPicker from "../../components/map/MapPicker";
import AppHeader from "../../components/ui/AppHeader";
import { useAuthStore } from "../../store/authStore";
import { createRequest } from "../../services/requestService";
import { CATEGORIES } from "../../utils/helpers";
import { Location } from "../../types";

const schema = z.object({
  title: z.string().min(3, "Título requerido (mín. 3 caracteres)"),
  description: z.string().optional(),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function SectionHeader({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View className="flex-row items-center mb-3">
      <View className="w-7 h-7 bg-primary/10 rounded-lg items-center justify-center mr-2">
        <Ionicons name={icon} size={15} color="#ad3020" />
      </View>
      <Text className="text-xs font-bold text-text-secondary tracking-widest">{title}</Text>
    </View>
  );
}

export default function CreateRequestScreen({ navigation, route }: CreateRequestScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [category, setCategory] = useState<string>(route.params?.category ?? "");
  const [location, setLocation] = useState<Location | undefined>(user?.location);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", quantity: "", unit: "", notes: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!location) {
      Alert.alert("Ubicación requerida", "Selecciona el punto de entrega en el mapa");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await createRequest({
        buyerId: user.id,
        title: data.title,
        description: data.description,
        quantity: data.quantity ? parseInt(data.quantity) : undefined,
        unit: data.unit,
        notes: data.notes,
        category,
        location,
      });
      Alert.alert("¡Publicada!", "Tu solicitud ya está visible para los vendedores", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bg-light"
    >
      <AppHeader title="Nueva Solicitud" showBack />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero gradient */}
        <LinearGradient
          colors={["#ad3020", "#e14924"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pt-4 pb-8"
        >
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text className="text-xl font-bold text-white mb-1">
              ¿Qué necesitas?
            </Text>
            <Text className="text-sm text-white/75">
              Publica tu solicitud y recibe ofertas de vendedores cercanos
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Section: Información básica */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(80)}
          className="mx-4 -mt-4 bg-white rounded-2xl p-4 mb-3"
          style={styles.card}
        >
          <SectionHeader icon="document-text-outline" title="INFORMACIÓN BÁSICA" />

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Título de la solicitud"
                placeholder="ej. Sillón de cuero vintage"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Descripción"
                placeholder="Describe lo más específico posible: marca, color, talla..."
                multiline
                numberOfLines={3}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <View className="flex-row">
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1 mr-2">
                  <TextField
                    label="Cantidad"
                    placeholder="12"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="unit"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1">
                  <TextField
                    label="Unidad"
                    placeholder="unidades"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
          </View>
        </Animated.View>

        {/* Section: Categoría */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(160)}
          className="mx-4 bg-white rounded-2xl p-4 mb-3"
          style={styles.card}
        >
          <SectionHeader icon="grid-outline" title="CATEGORÍA" />
          <View className="flex-row flex-wrap">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                selected={category === cat}
                onPress={() => setCategory(cat === category ? "" : cat)}
              />
            ))}
          </View>
          {!category && (
            <Text className="text-xs text-text-muted mt-1">
              Opcional — ayuda a los vendedores a encontrar tu solicitud
            </Text>
          )}
        </Animated.View>

        {/* Section: Ubicación */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(240)}
          className="mx-4 bg-white rounded-2xl p-4 mb-3"
          style={styles.card}
        >
          <SectionHeader icon="location-outline" title="UBICACIÓN DE ENTREGA" />
          <MapPicker value={location} onChange={setLocation} height={200} />
          {!location && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle-outline" size={13} color="#ad3020" />
              <Text className="text-xs text-primary ml-1 font-medium">
                Toca el mapa para marcar el punto de entrega
              </Text>
            </View>
          )}
          {location && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="checkmark-circle" size={13} color="#3a7558" />
              <Text className="text-xs text-success ml-1 font-medium">
                Punto de entrega marcado
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Section: Notas */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(320)}
          className="mx-4 bg-white rounded-2xl p-4 mb-4"
          style={styles.card}
        >
          <SectionHeader icon="chatbubble-ellipses-outline" title="NOTAS ADICIONALES" />
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Entrega en portería, llamar al llegar, horario preferido..."
                multiline
                numberOfLines={3}
                value={value}
                onChangeText={onChange}
                containerClassName="mb-0"
              />
            )}
          />
        </Animated.View>

        {/* Publish button */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          className="mx-4"
        >
          <PrimaryButton
            title="Publicar Solicitud"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            loading={loading}
            icon={<Ionicons name="megaphone-outline" size={18} color="#fff" />}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
