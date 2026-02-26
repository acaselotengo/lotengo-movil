import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as ExpoLocation from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Location } from "../../types";

interface MapPickerProps {
  value?: Location;
  onChange: (location: Location) => void;
  height?: number;
}

const DEFAULT_REGION: Region = {
  latitude: 6.2442,
  longitude: -75.5812,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

async function reverseGeocode(lat: number, lng: number): Promise<string | undefined> {
  try {
    const results = await ExpoLocation.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (results[0]) {
      const r = results[0];
      return [r.street, r.district ?? r.subregion, r.city, r.region]
        .filter(Boolean)
        .join(", ");
    }
  } catch {}
  return undefined;
}

export default function MapPicker({
  value,
  onChange,
  height = 200,
}: MapPickerProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(
    value
      ? {
          latitude: value.lat,
          longitude: value.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : DEFAULT_REGION
  );
  const [marker, setMarker] = useState<Location | undefined>(value);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === "granted" && !value) {
        const loc = await ExpoLocation.getCurrentPositionAsync({});
        const newRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 500);
      }
    })();
  }, []);

  const applyLocation = async (lat: number, lng: number) => {
    const loc: Location = { lat, lng };
    setMarker(loc);
    onChange(loc);
    const address = await reverseGeocode(lat, lng);
    if (address) {
      const locWithAddress: Location = { lat, lng, address };
      setMarker(locWithAddress);
      onChange(locWithAddress);
    }
  };

  const handlePress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    applyLocation(latitude, longitude);
  };

  const goToMyLocation = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const loc = await ExpoLocation.getCurrentPositionAsync({});
      const newRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 500);
      applyLocation(loc.coords.latitude, loc.coords.longitude);
    }
  };

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-end mb-1">
        <TouchableOpacity onPress={goToMyLocation} className="flex-row items-center">
          <Ionicons name="locate" size={14} color="#ad3020" />
          <Text className="text-xs text-primary ml-1">GPS actual</Text>
        </TouchableOpacity>
      </View>
      <View className="rounded-xl overflow-hidden border border-border-light" style={{ height }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={region}
          onPress={handlePress}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        >
          {marker && (
            <Marker
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                applyLocation(latitude, longitude);
              }}
            />
          )}
        </MapView>
      </View>
    </View>
  );
}
