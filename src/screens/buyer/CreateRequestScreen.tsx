import { CreateRequestScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Chip from "../../components/ui/Chip";
import MapPicker from "../../components/map/MapPicker";
import AppHeader from "../../components/ui/AppHeader";
import { useAuthStore } from "../../store/authStore";
import { createRequest } from "../../services/requestService";
import { CATEGORIES } from "../../utils/helpers";
import { Location } from "../../types";
import { Ionicons } from "@expo/vector-icons";

const schema = z.object({
  title: z.string().min(3, "Título requerido (mín. 3 caracteres)"),
  description: z.string().optional(),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateRequestScreen({ navigation }: CreateRequestScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<Location | undefined>();
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
      Alert.alert("Error", "Selecciona la ubicación de entrega en el mapa");
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
      Alert.alert("Publicada", "Tu solicitud ha sido publicada exitosamente");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <AppHeader title="NUEVA SOLICITUD" showBack />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-lg font-bold text-text-primary mt-4 mb-4">
          ¿Qué necesitas?
        </Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="TÍTULO DE LA SOLICITUD"
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
              label="DESCRIPCIÓN DEL PRODUCTO"
              placeholder="Describe lo más específico posible, marca, color, talla..."
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <View className="flex-row mb-3">
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

        <Text className="text-sm font-medium text-text-primary mb-2">Categoría</Text>
        <View className="flex-row flex-wrap mb-3">
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={category === cat}
              onPress={() => setCategory(cat === category ? "" : cat)}
            />
          ))}
        </View>

        <Text className="text-sm font-medium text-text-primary mb-2">
          Área de búsqueda
        </Text>
        <MapPicker value={location} onChange={setLocation} height={180} />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Notas adicionales"
              placeholder="Entrega en portería, llamar al llegar..."
              multiline
              numberOfLines={2}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <PrimaryButton
          title="Publicar"
          onPress={handleSubmit(onSubmit)}
          variant="secondary"
          loading={loading}
          icon={<Ionicons name="send" size={16} color="#fff" />}
          className="mt-2"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
