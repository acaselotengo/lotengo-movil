import { AddProductScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../components/ui/AppHeader";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Chip from "../../components/ui/Chip";
import SegmentedControl from "../../components/ui/SegmentedControl";
import { useAuthStore } from "../../store/authStore";
import { createProduct } from "../../services/productService";
import { CATEGORIES } from "../../utils/helpers";
import { EtaUnit } from "../../types";

const schema = z.object({
  name: z.string().min(2, "Nombre del producto requerido"),
  priceBase: z.string().optional(),
  etaValue: z.string().optional(),
  notes: z.string().optional(),
  conditions: z.string().optional(),
});

const ETA_UNITS: { label: string; value: EtaUnit }[] = [
  { label: "Min", value: "min" },
  { label: "Horas", value: "hours" },
  { label: "Días", value: "days" },
];

export default function AddProductScreen({ navigation }: AddProductScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [etaUnit, setEtaUnit] = useState<EtaUnit>("days");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      priceBase: "",
      etaValue: "",
      notes: "",
      conditions: "",
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as const,
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (!category) {
      Alert.alert("Error", "Selecciona una categoría");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await createProduct({
        sellerId: user.id,
        name: data.name,
        category,
        priceBase: data.priceBase ? parseFloat(data.priceBase) : undefined,
        etaValue: data.etaValue ? parseInt(data.etaValue) : undefined,
        etaUnit: data.etaValue ? etaUnit : undefined,
        notes: data.notes,
        conditions: data.conditions,
        images,
      });
      Alert.alert("Publicado", "Producto agregado al catálogo");
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
      <AppHeader title="Agregar Producto" showBack />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photos */}
        <View className="mt-4 mb-4">
          <Text className="text-sm font-semibold text-text-primary mb-2 text-center">
            Fotos del Producto
          </Text>
          <Text className="text-xs text-text-muted text-center mb-3">
            Sube hasta 5 fotos en formato PNG, JPG
          </Text>
          <View className="flex-row flex-wrap">
            {images.map((uri, i) => (
              <View key={i} className="mr-2 mb-2">
                <Image source={{ uri }} className="w-20 h-20 rounded-xl" />
                <TouchableOpacity
                  onPress={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-danger rounded-full w-5 h-5 items-center justify-center"
                >
                  <Ionicons name="close" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity
                onPress={pickImage}
                className="w-20 h-20 border-2 border-dashed border-border-light rounded-xl items-center justify-center"
              >
                <Ionicons name="camera-outline" size={24} color="#8694b8" />
                <Text className="text-xs text-text-muted mt-1">Agregar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text className="text-sm font-bold text-text-secondary mb-2 tracking-wider">
          INFORMACIÓN PRINCIPAL
        </Text>

        <Text className="text-sm font-medium text-text-primary mb-2">Categoría</Text>
        <View className="flex-row flex-wrap mb-3">
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Nombre del Producto/Servicio"
              placeholder="Ej. Café de Origen Huila (Tostado)"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="priceBase"
          render={({ field: { onChange, value } }) => (
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-primary mb-1">
                Precio ($)
              </Text>
              <View className="flex-row items-center bg-surface-tertiary border border-border-light rounded-xl px-4">
                <Text className="text-text-secondary mr-2">$</Text>
                <View className="flex-1">
                  <TextField
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    containerClassName="mb-0"
                  />
                </View>
              </View>
            </View>
          )}
        />

        <Text className="text-sm font-bold text-text-secondary mb-2 tracking-wider mt-2">
          LOGÍSTICA Y ENTREGA
        </Text>

        <View className="flex-row mb-3">
          <Controller
            control={control}
            name="etaValue"
            render={({ field: { onChange, value } }) => (
              <View className="flex-1 mr-2">
                <TextField
                  label="Tiempo"
                  placeholder="1"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          <View className="flex-1">
            <Text className="text-sm font-medium text-text-primary mb-1">Unidad</Text>
            <SegmentedControl
              options={ETA_UNITS.map((u) => u.label)}
              selected={ETA_UNITS.find((u) => u.value === etaUnit)?.label || "Días"}
              onSelect={(label) => {
                const found = ETA_UNITS.find((u) => u.label === label);
                if (found) setEtaUnit(found.value);
              }}
            />
          </View>
        </View>

        <Text className="text-sm font-bold text-text-secondary mb-2 tracking-wider mt-2">
          DETALLES ADICIONALES
        </Text>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Observaciones"
              placeholder="Describe los detalles únicos, el origen o el proceso de creación..."
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="conditions"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Condiciones"
              placeholder="Política de devolución, garantías o condiciones de envío..."
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <PrimaryButton
          title="Publicar Producto"
          onPress={handleSubmit(onSubmit)}
          variant="accent"
          loading={loading}
          className="mt-2"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
