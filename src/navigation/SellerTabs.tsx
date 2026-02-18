import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import SellerAlertsScreen from "../screens/seller/SellerAlertsScreen";
import SellerMapScreen from "../screens/seller/SellerMapScreen";
import MyOffersScreen from "../screens/seller/MyOffersScreen";
import CatalogScreen from "../screens/seller/CatalogScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import { SellerTabParamList } from "../types/navigation";
import { sharedTabBarOptions } from "./tabBarConfig";

const Tab = createBottomTabNavigator<SellerTabParamList>();

const iconMap: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Alertas: { active: "notifications", inactive: "notifications-outline" },
  Mapa: { active: "map", inactive: "map-outline" },
  Ofertas: { active: "pricetags", inactive: "pricetags-outline" },
  "Catálogo": { active: "grid", inactive: "grid-outline" },
  Perfil: { active: "person", inactive: "person-outline" },
};

export default function SellerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...sharedTabBarOptions,
        tabBarActiveTintColor: "#ef741c",
        tabBarIcon: ({ color, size, focused }) => {
          const icons = iconMap[route.name] || { active: "home", inactive: "home-outline" };
          return (
            <View className="items-center">
              {focused && (
                <View className="w-1 h-1 rounded-full bg-accent absolute -top-1.5" />
              )}
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={size}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Alertas" component={SellerAlertsScreen} />
      <Tab.Screen name="Mapa" component={SellerMapScreen} />
      <Tab.Screen name="Ofertas" component={MyOffersScreen} />
      <Tab.Screen name="Catálogo" component={CatalogScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
