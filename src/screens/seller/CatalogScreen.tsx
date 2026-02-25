import { CatalogScreenProps } from "../../types/navigation";
import React, { useCallback, useState, useMemo } from "react";
import { View, Text, FlatList, Alert, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../../components/ui/AppHeader";
import FAB from "../../components/ui/FAB";
import StatCard from "../../components/ui/StatCard";
import ProductCard from "../../components/cards/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/authStore";
import { getProductsBySeller, deleteProduct } from "../../services/productService";
import { Product } from "../../types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function CatalogScreen({ navigation }: CatalogScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState<Product[]>([]);

  const reload = useCallback(() => {
    if (user) setProducts(getProductsBySeller(user.id));
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Eliminar producto", "¿Estás seguro?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: async () => {
          await deleteProduct(id);
          reload();
        },
        style: "destructive",
      },
    ]);
  }, [reload]);

  const renderProduct = useCallback(({ item, index }: { item: Product; index: number }) => (
    <View style={{ width: CARD_WIDTH }}>
      <ProductCard
        product={item}
        onDelete={() => handleDelete(item.id)}
        index={index}
      />
    </View>
  ), [handleDelete]);

  return (
    <View className="flex-1 bg-bg-light">
      <AppHeader title="Mi Catálogo" />
      <View className="flex-1 px-4 pt-3">
        <View className="flex-row mb-4">
          <StatCard value={products.length} label="Productos" color="#ef741c" />
          <StatCard value={categories.length} label="Categorías" color="#ef741c" />
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          renderItem={renderProduct}
          ListEmptyComponent={
            <EmptyState
              icon="grid-outline"
              title="Sin productos"
              subtitle="Agrega tu primer producto al catálogo."
              actionLabel="Agregar Producto"
              onAction={() => navigation.navigate("AddProduct")}
              iconColor="#ef741c"
              iconBgColor="bg-accent/10"
            />
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <FAB
        onPress={() => navigation.navigate("AddProduct")}
        icon="add"
        color="#ef741c"
      />
    </View>
  );
}
