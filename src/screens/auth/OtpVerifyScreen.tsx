import { OtpVerifyScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { verifyOtp, resetPassword } from "../../services/authService";

const schema = z
  .object({
    otp: z.string().length(6, "Código debe ser 6 dígitos"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmar contraseña"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function OtpVerifyScreen({ route, navigation }: OtpVerifyScreenProps) {
  const { email } = route.params;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const valid = await verifyOtp(email, data.otp);
      if (!valid) {
        Alert.alert("Error", "Código inválido o expirado");
        setLoading(false);
        return;
      }
      await resetPassword(email, data.otp, data.newPassword);
      Alert.alert("Éxito", "Contraseña actualizada correctamente", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6" keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 mb-6">
        <Ionicons name="chevron-back" size={24} color="#15163e" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-text-primary mb-2">
        Verificar código
      </Text>
      <Text className="text-sm text-text-secondary mb-6">
        Ingresa el código enviado a {email}
      </Text>

      <Controller
        control={control}
        name="otp"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Código OTP"
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            value={value}
            onChangeText={onChange}
            error={errors.otp?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, value } }) => (
          <PasswordField
            label="Nueva contraseña"
            placeholder="Mínimo 8 caracteres"
            value={value}
            onChangeText={onChange}
            error={errors.newPassword?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <PasswordField
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={value}
            onChangeText={onChange}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <PrimaryButton
        title="Cambiar contraseña"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        className="mt-4"
      />
    </ScrollView>
  );
}
