import { ChangePasswordScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppHeader from "../../components/ui/AppHeader";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useAuthStore } from "../../store/authStore";
import { changePassword } from "../../services/authService";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Contraseña actual requerida"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmar contraseña"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function ChangePasswordScreen({ navigation }: ChangePasswordScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: any) => {
    if (!user) return;
    setLoading(true);
    try {
      await changePassword(user.id, data.currentPassword, data.newPassword);
      Alert.alert("Éxito", "Contraseña actualizada", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AppHeader title="Cambiar Contraseña" showBack />
      <ScrollView className="px-6 pt-4" keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, value } }) => (
            <PasswordField
              label="Contraseña actual"
              placeholder="Tu contraseña actual"
              value={value}
              onChangeText={onChange}
              error={errors.currentPassword?.message}
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
              label="Confirmar nueva contraseña"
              placeholder="Repite tu nueva contraseña"
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
            />
          )}
        />
        <PrimaryButton
          title="Actualizar contraseña"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          className="mt-4"
        />
      </ScrollView>
    </View>
  );
}
