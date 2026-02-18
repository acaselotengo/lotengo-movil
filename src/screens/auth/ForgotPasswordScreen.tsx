import { ForgotPasswordScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { requestPasswordReset } from "../../services/authService";

const schema = z.object({
  email: z.string().email("Correo inválido"),
});

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      const otp = await requestPasswordReset(data.email);
      Alert.alert("Código enviado", `Tu código OTP es: ${otp}\n(Simulado para demo)`);
      navigation.navigate("OtpVerify", { email: data.email });
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
        Recuperar Contraseña
      </Text>
      <Text className="text-sm text-text-secondary mb-6">
        Ingresa tu correo electrónico y te enviaremos un código de verificación.
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Correo electrónico"
            placeholder="nombre@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      <PrimaryButton
        title="Enviar código"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        className="mt-4"
      />
    </ScrollView>
  );
}
