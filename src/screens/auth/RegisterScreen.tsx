import { RegisterScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import TextField from "../../components/ui/TextField";
import SelectField from "../../components/ui/SelectField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import GoogleButton from "../../components/ui/GoogleButton";
import SegmentedControl from "../../components/ui/SegmentedControl";
import DividerOr from "../../components/ui/DividerOr";
import BrandLogo from "../../components/BrandLogo";
import { register } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { DEPARTMENTS } from "../../utils/helpers";
import { UserRole } from "../../types";

const schema = z
  .object({
    name: z.string().min(2, "Nombre requerido"),
    phone: z.string().min(7, "Teléfono requerido"),
    department: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    email: z.string().min(1, "Correo requerido").email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmar contraseña"),
    businessName: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [role, setRole] = useState<UserRole>("buyer");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      department: "",
      city: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = await register({
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
        role,
        department: data.department,
        city: data.city,
        address: data.address,
        businessName: data.businessName,
      });
      setUser(user);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const isSeller = role === "seller";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bg-light"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        <View className="flex-row items-center mt-4 mb-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-9 h-9 rounded-full bg-surface-tertiary items-center justify-center"
          >
            <Ionicons name="chevron-back" size={20} color="#15163e" />
          </TouchableOpacity>
          <View className="ml-3">
            <BrandLogo size={90} accessibilityLabel="LO TENGO" />
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(400)}>
          <Text className="text-2xl font-bold text-text-primary mb-1">
            {isSeller ? "Registro de Oferente" : "Registro Comprador"}
          </Text>
          <Text className="text-sm text-text-secondary mb-5">
            {isSeller
              ? "Únete a la red de proveedores en Colombia"
              : "Completa tus datos para comprar en Colombia"}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <SegmentedControl
            options={["Soy Comprador", "Soy Oferente"]}
            selected={isSeller ? "Soy Oferente" : "Soy Comprador"}
            onSelect={(opt) =>
              setRole(opt === "Soy Oferente" ? "seller" : "buyer")
            }
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          {isSeller && (
            <Controller
              control={control}
              name="businessName"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Nombre o Razón Social"
                  placeholder="Ej. Comercializadora SAS"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextField
                label={isSeller ? "Nombre de contacto" : "Nombre completo"}
                placeholder="Ej. Juan Pérez"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View className="mb-3">
                <Text className="text-sm font-semibold text-text-primary mb-1.5">
                  Celular
                </Text>
                <View className="flex-row">
                  <View className="bg-surface-tertiary rounded-xl px-3 py-3 mr-2 flex-row items-center">
                    <Text className="text-text-primary font-medium">+57</Text>
                  </View>
                  <View className="flex-1">
                    <TextField
                      placeholder="300 123 4567"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      error={errors.phone?.message}
                      containerClassName="mb-0"
                    />
                  </View>
                </View>
              </View>
            )}
          />

          <View className="flex-row mb-3">
            <Controller
              control={control}
              name="department"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1 mr-2">
                  <SelectField
                    label="Departamento"
                    placeholder="Selecciona"
                    value={value}
                    options={DEPARTMENTS}
                    onSelect={onChange}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1">
                  <TextField
                    label="Ciudad"
                    placeholder="Ej. Medellín"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
          </View>

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <TextField
                label={isSeller ? "Dirección del negocio" : "Dirección"}
                placeholder="Carrera 43A #1-50"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <PasswordField
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <PasswordField
                label="Confirmar Contraseña"
                placeholder="Repite tu contraseña"
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <PrimaryButton
            title={isSeller ? "Completar Registro" : "Registrarse"}
            onPress={handleSubmit(onSubmit)}
            variant={isSeller ? "accent" : "primary"}
            loading={loading}
            icon={<Ionicons name="chevron-forward" size={18} color="#fff" />}
            className="mt-2"
          />

          <DividerOr />

          <GoogleButton label="Registrarse con Google" />

          <View className="flex-row justify-center mt-4">
            <Text className="text-text-secondary text-sm">
              ¿Ya tienes cuenta?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-primary font-bold text-sm">
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
