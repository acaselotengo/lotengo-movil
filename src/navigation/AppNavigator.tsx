import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";
import { loadDb } from "../db/mockDb";
import AuthStack from "./AuthStack";
import BuyerTabs from "./BuyerTabs";
import SellerTabs from "./SellerTabs";
import { BuyerStackParamList, SellerStackParamList } from "../types/navigation";

import ChatScreen from "../screens/shared/ChatScreen";
import ChangePasswordScreen from "../screens/shared/ChangePasswordScreen";
import CreateRequestScreen from "../screens/buyer/CreateRequestScreen";
import RequestDetailScreen from "../screens/buyer/RequestDetailScreen";
import SellerRequestDetailScreen from "../screens/seller/SellerRequestDetailScreen";
import SendOfferScreen from "../screens/seller/SendOfferScreen";
import AddProductScreen from "../screens/seller/AddProductScreen";

const BuyerRootStack = createNativeStackNavigator<BuyerStackParamList>();
const SellerRootStack = createNativeStackNavigator<SellerStackParamList>();

const logoSource = require("../../assets/logoLotengo.png");

function BuyerStack() {
  return (
    <BuyerRootStack.Navigator screenOptions={{ headerShown: false }}>
      <BuyerRootStack.Screen name="BuyerMain" component={BuyerTabs} />
      <BuyerRootStack.Screen name="CreateRequest" component={CreateRequestScreen} />
      <BuyerRootStack.Screen name="RequestDetail" component={RequestDetailScreen} />
      <BuyerRootStack.Screen name="Chat" component={ChatScreen} />
      <BuyerRootStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </BuyerRootStack.Navigator>
  );
}

function SellerStack() {
  return (
    <SellerRootStack.Navigator screenOptions={{ headerShown: false }}>
      <SellerRootStack.Screen name="SellerMain" component={SellerTabs} />
      <SellerRootStack.Screen name="SellerRequestDetail" component={SellerRequestDetailScreen} />
      <SellerRootStack.Screen name="SendOffer" component={SendOfferScreen} />
      <SellerRootStack.Screen name="AddProduct" component={AddProductScreen} />
      <SellerRootStack.Screen name="Chat" component={ChatScreen} />
      <SellerRootStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </SellerRootStack.Navigator>
  );
}

export default function AppNavigator() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const loadSession = useAuthStore((s) => s.loadSession);

  useEffect(() => {
    const init = async () => {
      await loadDb();
      await loadSession();
    };
    init();
  }, [loadSession]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Image
          source={logoSource}
          style={{ width: 160, height: 72 }}
          resizeMode="contain"
          accessible
          accessibilityLabel="LO TENGO"
        />
        <Text className="text-sm text-text-muted mt-4 font-medium">Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === "buyer" ? (
        <BuyerStack />
      ) : (
        <SellerStack />
      )}
    </NavigationContainer>
  );
}
