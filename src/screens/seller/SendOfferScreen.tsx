import { SendOfferScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppHeader from "../../components/ui/AppHeader";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SegmentedControl from "../../components/ui/SegmentedControl";
import { useAuthStore } from "../../store/authStore";
import { createOffer } from "../../services/offerService";
import { getRequestById } from "../../services/requestService";
import { EtaUnit } from "../../types";
import { Ionicons } from "@expo/vector-icons";

const schema = z.object({
  price: z.string().min(1, "Precio requerido"),
  etaValue: z.string().min(1, "Tiempo requerido"),
  notes: z.string().optional(),
});

const ETA_UNITS: { label: string; value: EtaUnit }[] = [
  { label: "Min", value: "min" },
  { label: "Horas", value: "hours" },
  { label: "Días", value: "days" },
];

export default function SendOfferScreen({ route, navigation }: SendOfferScreenProps) {
  const { requestId } = route.params;
  const user = useAuthStore((s) => s.user);
  const request = getRequestById(requestId);
  const [etaUnit, setEtaUnit] = useState<EtaUnit>("min");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { price: "", etaValue: "", notes: "" },
  });

  type FormData = z.infer<typeof schema>;

  const onSubmit = async (data: FormData) => {
    const price = parseFloat(data.price);
    const etaValue = parseInt(data.etaValue);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "El precio debe ser mayor a 0");
      return;
    }
    if (isNaN(etaValue) || etaValue <= 0) {
      Alert.alert("Error", "El tiempo debe ser mayor a 0");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await createOffer({
        requestId,
        sellerId: user.id,
        price,
        etaValue,
        etaUnit,
        notes: data.notes,
      });
      Alert.alert("Enviada", "Tu oferta fue enviada exitosamente");
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
      <AppHeader title="Enviar Oferta" showBack />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        {request && (
          <View className="bg-surface-tertiary rounded-xl p-3 mt-3 mb-4">
            <Text className="text-sm text-text-secondary">Solicitud:</Text>
            <Text className="text-base font-semibold text-text-primary">
              {request.title}
            </Text>
          </View>
        )}

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-primary mb-1">
                Precio (COP)
              </Text>
              <View className="flex-row items-center bg-surface-tertiary border border-border-light rounded-xl px-4">
                <Text className="text-text-secondary mr-2">$</Text>
                <View className="flex-1">
                  <TextField
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    error={errors.price?.message}
                    containerClassName="mb-0"
                  />
                </View>
              </View>
            </View>
          )}
        />

        <View className="mb-3">
          <Text className="text-sm font-medium text-text-primary mb-2">
            Tiempo de entrega
          </Text>
          <View className="flex-row">
            <Controller
              control={control}
              name="etaValue"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1 mr-2">
                  <TextField
                    placeholder="30"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    error={errors.etaValue?.message}
                  />
                </View>
              )}
            />
            <View className="flex-1">
              <SegmentedControl
                options={ETA_UNITS.map((u) => u.label)}
                selected={ETA_UNITS.find((u) => u.value === etaUnit)?.label || "Min"}
                onSelect={(label) => {
                  const found = ETA_UNITS.find((u) => u.label === label);
                  if (found) setEtaUnit(found.value);
                }}
              />
            </View>
          </View>
        </View>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Notas (opcional)"
              placeholder="Ej: Incluye hielo sin costo"
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <PrimaryButton
          title="Enviar Oferta"
          onPress={handleSubmit(onSubmit)}
          variant="accent"
          loading={loading}
          className="mt-4"
          icon={<Ionicons name="send" size={16} color="#fff" />}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
