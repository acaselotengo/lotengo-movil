import { SellerMapScreenProps } from "../../types/navigation";
import React, { useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { getOpenRequests } from "../../services/requestService";
import { useAuthStore } from "../../store/authStore";
import { Request } from "../../types";
import { formatDate } from "../../utils/helpers";

export default function SellerMapScreen({ navigation }: SellerMapScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState<Request[]>([]);
  const mapRef = useRef<MapView>(null);

  useFocusEffect(
    useCallback(() => {
      setRequests(getOpenRequests());
    }, [])
  );

  const initialRegion = user?.location
    ? {
        latitude: user.location.lat,
        longitude: user.location.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 6.2442,
        longitude: -75.5812,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton
      >
        {requests.map((req) => (
          <Marker
            key={req.id}
            coordinate={{
              latitude: req.location.lat,
              longitude: req.location.lng,
            }}
            pinColor="#ad3020"
            onCalloutPress={() =>
              navigation.navigate("SellerRequestDetail", { requestId: req.id })
            }
          >
            <Callout tooltip={false}>
              <View style={{ width: 200, padding: 6 }}>
                <Text style={{ fontWeight: "bold", fontSize: 14, color: "#15163e" }}>
                  {req.title}
                </Text>
                <Text style={{ fontSize: 12, color: "#8694b8", marginTop: 2 }}>
                  {formatDate(req.createdAt)}
                </Text>
                <Text style={{ fontSize: 12, color: "#ad3020", marginTop: 4, fontWeight: "600" }}>
                  Toca para ver →
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View className="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 shadow-sm">
        <Text className="text-xs font-semibold text-text-primary">
          {requests.length} solicitud{requests.length !== 1 ? "es" : ""} abiertas
        </Text>
      </View>
    </View>
  );
}
