import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import BuyerHomeScreen from "../screens/buyer/BuyerHomeScreen";
import MyRequestsScreen from "../screens/buyer/MyRequestsScreen";
import ChatsListScreen from "../screens/shared/ChatsListScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import { BuyerTabParamList } from "../types/navigation";
import { sharedTabBarOptions } from "./tabBarConfig";

const Tab = createBottomTabNavigator<BuyerTabParamList>();

const iconMap: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Inicio: { active: "home", inactive: "home-outline" },
  Solicitudes: { active: "document-text", inactive: "document-text-outline" },
  Mensajes: { active: "chatbubbles", inactive: "chatbubbles-outline" },
  Perfil: { active: "person", inactive: "person-outline" },
};

export default function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...sharedTabBarOptions,
        tabBarActiveTintColor: "#ad3020",
        tabBarIcon: ({ color, size, focused }) => {
          const icons = iconMap[route.name] || { active: "home", inactive: "home-outline" };
          return (
            <View className="items-center">
              {focused && (
                <View className="w-1 h-1 rounded-full bg-primary absolute -top-1.5" />
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
      <Tab.Screen name="Inicio" component={BuyerHomeScreen} />
      <Tab.Screen name="Solicitudes" component={MyRequestsScreen} />
      <Tab.Screen name="Mensajes" component={ChatsListScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
