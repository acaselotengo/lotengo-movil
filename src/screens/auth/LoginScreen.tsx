import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import GoogleButton from "../../components/ui/GoogleButton";
import DividerOr from "../../components/ui/DividerOr";
import BrandLogo from "../../components/BrandLogo";
import { login } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { LoginScreenProps } from "../../types/navigation";

const schema = z.object({
  email: z.string().min(1, "Correo requerido").email("Correo inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const user = login(data.email, data.password);
    setLoading(false);
    if (user) {
      setUser(user);
    } else {
      Alert.alert("Error", "Correo o contraseña incorrectos");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient
        colors={["#ad3020", "#e14924", "#ef741c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo area */}
          <Animated.View
            entering={FadeIn.duration(600)}
            className="items-center pt-16 pb-8"
          >
            <View className="mb-2" style={styles.logoShadow}>
              <BrandLogo size={180} accessibilityLabel="LO TENGO - Reverse Marketplace" />
            </View>
            <Text className="text-sm text-white/70 mt-1 tracking-widest font-medium">
              REVERSE MARKETPLACE
            </Text>
          </Animated.View>

          {/* Form card */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(200)}
            className="flex-1 bg-white rounded-t-3xl px-6 pt-8"
            style={styles.formCard}
          >
            <Text className="text-2xl font-bold text-text-primary mb-1">
              Bienvenido
            </Text>
            <Text className="text-sm text-text-secondary mb-6">
              Inicia sesión para continuar
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Correo electrónico"
                  placeholder="ej. nombre@correo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordField
                  label="Contraseña"
                  placeholder="********"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              className="self-end mb-6"
            >
              <Text className="text-sm text-primary font-semibold">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Iniciar Sesión"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              icon={<Ionicons name="log-in-outline" size={18} color="#fff" />}
            />

            <View className="flex-row justify-center mt-5">
              <Text className="text-text-secondary text-sm">
                ¿No tienes una cuenta?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text className="text-primary font-bold text-sm">
                  Crear una cuenta
                </Text>
              </TouchableOpacity>
            </View>

            <DividerOr />

            <GoogleButton />

            <View className="h-8" />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  formCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
});
