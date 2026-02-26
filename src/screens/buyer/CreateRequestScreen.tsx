import { CreateRequestScreenProps } from "../../types/navigation";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
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
import SelectField from "../../components/ui/SelectField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Chip from "../../components/ui/Chip";
import MapPicker from "../../components/map/MapPicker";
import AppHeader from "../../components/ui/AppHeader";
import { useAuthStore } from "../../store/authStore";
import { createRequest } from "../../services/requestService";
import { getUserById, saveFrequentAddress } from "../../services/authService";
import { CATEGORIES, DEPARTMENTS } from "../../utils/helpers";
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

function isSameLocation(a: Location, b: Location) {
  return Math.abs(a.lat - b.lat) < 0.0001 && Math.abs(a.lng - b.lng) < 0.0001;
}

function AddressChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-2 mb-1 px-3 py-1.5 rounded-full border flex-row items-center ${
        selected ? "bg-primary border-primary" : "bg-surface-tertiary border-border-light"
      }`}
    >
      <Ionicons
        name={selected ? "checkmark-circle" : "location-outline"}
        size={12}
        color={selected ? "#fff" : "#ad3020"}
      />
      <Text
        className={`text-xs font-medium ml-1 max-w-[160px] ${selected ? "text-white" : "text-text-primary"}`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function CreateRequestScreen({ navigation, route }: CreateRequestScreenProps) {
  const user = useAuthStore((s) => s.user);
  const freshUser = user ? getUserById(user.id) : null;
  const baseUser = freshUser ?? user;

  const [category, setCategory] = useState<string>(route.params?.category ?? "");
  const [location, setLocation] = useState<Location | undefined>(baseUser?.location);
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newDept, setNewDept] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newStreet, setNewStreet] = useState("");

  const registeredLocation = baseUser?.location;
  const frequentAddresses = baseUser?.frequentAddresses ?? [];

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

      // Guardar en frecuentes si es diferente a la dirección registrada
      const isDifferentFromRegistered =
        !registeredLocation || !isSameLocation(location, registeredLocation);
      if (isDifferentFromRegistered) {
        await saveFrequentAddress(user.id, location);
      }

      Alert.alert("¡Publicada!", "Tu solicitud ya está visible para los vendedores", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addressLabel = (loc: Location) =>
    loc.address ?? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;

  const handleAddNewAddress = () => {
    if (!newStreet.trim() || !newCity.trim()) {
      Alert.alert("Campos requeridos", "Ingresa al menos la ciudad y la dirección");
      return;
    }
    const addressText = [newStreet.trim(), newCity.trim(), newDept].filter(Boolean).join(", ");
    const baseLat = location?.lat ?? registeredLocation?.lat ?? 6.2442;
    const baseLng = location?.lng ?? registeredLocation?.lng ?? -75.5812;
    const newLoc: Location = { lat: baseLat, lng: baseLng, address: addressText };
    setLocation(newLoc);
    setShowAddressModal(false);
    setNewDept("");
    setNewCity("");
    setNewStreet("");
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
            <Text className="text-xl font-bold text-white mb-1">¿Qué necesitas?</Text>
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

          {/* Dirección registrada */}
          {registeredLocation && (
            <View className="mb-3">
              <Text className="text-xs text-text-muted mb-1.5">Tu dirección registrada</Text>
              <TouchableOpacity
                onPress={() => setLocation(registeredLocation)}
                className={`rounded-xl px-3 py-2.5 flex-row items-start border ${
                  location && isSameLocation(location, registeredLocation)
                    ? "bg-primary/5 border-primary/30"
                    : "bg-surface-tertiary border-transparent"
                }`}
              >
                <Ionicons name="home-outline" size={14} color="#ad3020" style={{ marginTop: 1 }} />
                <Text className="text-sm text-text-primary ml-2 flex-1">
                  {addressLabel(registeredLocation)}
                </Text>
                {location && isSameLocation(location, registeredLocation) && (
                  <Ionicons name="checkmark-circle" size={16} color="#3a7558" />
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Direcciones frecuentes */}
          {frequentAddresses.length > 0 && (
            <View className="mb-3">
              <Text className="text-xs text-text-muted mb-1.5">Direcciones frecuentes</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 4 }}
              >
                {frequentAddresses.map((addr, i) => (
                  <AddressChip
                    key={i}
                    label={addressLabel(addr)}
                    selected={!!location && isSameLocation(location, addr)}
                    onPress={() => setLocation(addr)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Botón agregar nueva dirección */}
          <TouchableOpacity
            onPress={() => setShowAddressModal(true)}
            className="flex-row items-center mb-3 py-2"
          >
            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center mr-2">
              <Ionicons name="add" size={14} color="#ad3020" />
            </View>
            <Text className="text-sm text-primary font-semibold">Agregar nueva dirección</Text>
          </TouchableOpacity>

          {/* Mapa */}
          <MapPicker value={location} onChange={setLocation} height={180} />

          {/* Dirección seleccionada */}
          {location ? (
            <View className="flex-row items-start mt-1">
              <Ionicons name="checkmark-circle" size={14} color="#3a7558" style={{ marginTop: 1 }} />
              <Text className="text-sm text-text-primary ml-1.5 flex-1" numberOfLines={2}>
                {addressLabel(location)}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle-outline" size={13} color="#ad3020" />
              <Text className="text-xs text-primary ml-1 font-medium">
                Toca el mapa para marcar el punto de entrega
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
        <Animated.View entering={FadeInDown.duration(400).delay(400)} className="mx-4">
          <PrimaryButton
            title="Publicar Solicitud"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            loading={loading}
            icon={<Ionicons name="megaphone-outline" size={18} color="#fff" />}
          />
        </Animated.View>
      </ScrollView>

      {/* Modal: Nueva dirección */}
      <Modal visible={showAddressModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.overlay}>
            <View className="bg-white rounded-t-3xl" style={styles.sheet}>
              <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-border-light">
                <Text className="text-base font-bold text-text-primary">Nueva dirección</Text>
                <TouchableOpacity
                  onPress={() => setShowAddressModal(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={22} color="#8694b8" />
                </TouchableOpacity>
              </View>

              <ScrollView
                className="px-5 pt-4"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <SelectField
                  label="Departamento"
                  placeholder="Selecciona un departamento"
                  value={newDept}
                  options={DEPARTMENTS}
                  onSelect={setNewDept}
                />
                <TextField
                  label="Ciudad"
                  placeholder="ej. Medellín"
                  value={newCity}
                  onChangeText={setNewCity}
                />
                <TextField
                  label="Dirección"
                  placeholder="ej. Calle 43 #10-20, Apto 201"
                  value={newStreet}
                  onChangeText={setNewStreet}
                  containerClassName="mb-2"
                />
                <Text className="text-xs text-text-muted mb-4">
                  El pin en el mapa se actualizará a tu ubicación actual. Puedes ajustarlo tocando el mapa.
                </Text>
              </ScrollView>

              <View className="flex-row px-5 pb-8 pt-3 gap-3">
                <TouchableOpacity
                  onPress={() => setShowAddressModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border-light items-center"
                >
                  <Text className="text-text-secondary font-semibold">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddNewAddress}
                  className="flex-1 py-3 rounded-xl bg-primary items-center"
                >
                  <Text className="text-white font-semibold">Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "80%",
  },
});
