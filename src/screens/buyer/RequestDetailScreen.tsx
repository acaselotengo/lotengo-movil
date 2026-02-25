import { RequestDetailScreenProps } from "../../types/navigation";
import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, FlatList, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../components/ui/AppHeader";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";
import OfferCard from "../../components/cards/OfferCard";
import RatingStars from "../../components/ui/RatingStars";
import { useAuthStore } from "../../store/authStore";
import { getRequestById, updateRequestStatus } from "../../services/requestService";
import { getOffersByRequest, acceptOffer, getOfferById } from "../../services/offerService";
import { getChatByRequest } from "../../services/chatService";
import { hasUserRated, createRating, getRatingsByRequest } from "../../services/ratingService";
import { getUserById } from "../../services/authService";
import {
  formatDate,
  formatCOP,
  getStatusLabel,
  getStatusColor,
} from "../../utils/helpers";
import { Request, Offer, Chat } from "../../types";
import TextField from "../../components/ui/TextField";

export default function RequestDetailScreen({ route, navigation }: RequestDetailScreenProps) {
  const { requestId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [request, setRequest] = useState<Request | undefined>();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [chat, setChat] = useState<Chat | undefined>();
  const [sortBy, setSortBy] = useState<"price" | "time">("price");
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [, setRefresh] = useState(0);

  const reload = useCallback(() => {
    const req = getRequestById(requestId);
    setRequest(req);
    const ofrs = getOffersByRequest(requestId);
    setOffers(
      sortBy === "price"
        ? [...ofrs].sort((a, b) => a.price - b.price)
        : [...ofrs].sort((a, b) => a.etaValue - b.etaValue)
    );
    setChat(getChatByRequest(requestId));
    if (user && req) {
      setAlreadyRated(hasUserRated(requestId, user.id));
    }
  }, [requestId, sortBy, user]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (!request) return null;

  const isBuyer = user?.id === request.buyerId;
  const { bg: statusBg, text: statusText } = getStatusColor(request.status);
  const acceptedOffer = request.acceptedOfferId
    ? getOfferById(request.acceptedOfferId)
    : undefined;
  const acceptedSeller = acceptedOffer
    ? getUserById(acceptedOffer.sellerId)
    : undefined;

  const handleAcceptOffer = async (offerId: string) => {
    Alert.alert("Aceptar oferta", "¿Estás seguro?", [
      { text: "Cancelar" },
      {
        text: "Aceptar",
        onPress: async () => {
          await acceptOffer(offerId);
          reload();
        },
      },
    ]);
  };

  const handleCloseRequest = async () => {
    await updateRequestStatus(requestId, "CLOSED");
    reload();
  };

  const handleAcceptProduct = async () => {
    await updateRequestStatus(requestId, "ACCEPTED");
    reload();
  };

  const handleRate = async () => {
    if (ratingStars === 0) {
      Alert.alert("Error", "Selecciona al menos 1 estrella");
      return;
    }
    if (!acceptedOffer || !user) return;
    const toUserId = acceptedOffer.sellerId;
    try {
      await createRating(requestId, user.id, toUserId, ratingStars, ratingComment);
      setAlreadyRated(true);
      setRefresh((v) => v + 1);
      Alert.alert("Gracias", "Tu calificación fue enviada");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View className="flex-1 bg-bg-light">
      <AppHeader title="Detalle Solicitud" showBack />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Request info */}
        <Card className="mt-3">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-lg font-bold text-text-primary flex-1">
              {request.title}
            </Text>
            <View className={`px-2.5 py-1 rounded-full ${statusBg}`}>
              <Text className={`text-xs font-medium ${statusText}`}>
                {getStatusLabel(request.status)}
              </Text>
            </View>
          </View>
          {request.description && (
            <Text className="text-sm text-text-secondary mb-2">{request.description}</Text>
          )}
          <Text className="text-xs text-text-muted">{formatDate(request.createdAt)}</Text>
          {request.quantity && (
            <Text className="text-sm text-text-secondary mt-1">
              Cantidad: {request.quantity} {request.unit || ""}
            </Text>
          )}
          {request.notes && (
            <Text className="text-sm text-text-secondary mt-1">
              Nota: {request.notes}
            </Text>
          )}
        </Card>

        {/* Accepted seller summary */}
        {acceptedOffer && acceptedSeller && (
          <Card className="mt-3 border-l-4 border-l-success">
            <Text className="text-sm font-semibold text-success mb-1">
              Vendedor seleccionado
            </Text>
            <Text className="text-base font-bold text-text-primary">
              {acceptedSeller.name}
            </Text>
            <Text className="text-sm text-primary font-semibold mt-1">
              {formatCOP(acceptedOffer.price)}
            </Text>
          </Card>
        )}

        {/* Chat access */}
        {chat && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
            className="bg-primary rounded-xl py-3 mt-3 flex-row items-center justify-center"
          >
            <Ionicons name="chatbubbles" size={18} color="#fff" />
            <Text className="text-white font-semibold ml-2">Ir al Chat</Text>
          </TouchableOpacity>
        )}

        {/* Actions for buyer */}
        {isBuyer && request.status === "NEGOTIATING" && (
          <View className="mt-3">
            <PrimaryButton
              title="Marcar venta como cerrada"
              onPress={handleCloseRequest}
              variant="accent"
            />
          </View>
        )}

        {isBuyer && request.status === "CLOSED" && (
          <View className="mt-3">
            <PrimaryButton
              title="Marcar producto aceptado"
              onPress={handleAcceptProduct}
              variant="primary"
            />
          </View>
        )}

        {/* Rating section */}
        {isBuyer && request.status === "ACCEPTED" && !alreadyRated && (
          <Card className="mt-4">
            <Text className="text-base font-bold text-text-primary mb-2">
              Califica al vendedor
            </Text>
            <RatingStars rating={ratingStars} size={32} interactive onChange={setRatingStars} />
            <TextField
              placeholder="Comentario (opcional)"
              value={ratingComment}
              onChangeText={setRatingComment}
              containerClassName="mt-3"
            />
            <PrimaryButton title="Enviar calificación" onPress={handleRate} className="mt-2" />
          </Card>
        )}

        {alreadyRated && request.status === "ACCEPTED" && (
          <Card className="mt-3 items-center">
            <Ionicons name="checkmark-circle" size={24} color="#3a7558" />
            <Text className="text-sm text-success mt-1">Ya calificaste esta transacción</Text>
          </Card>
        )}

        {/* Offers section (OPEN = can accept; NEGOTIATING = read-only view) */}
        {(request.status === "OPEN" || request.status === "NEGOTIATING") && isBuyer && (
          <View className="mt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-text-primary">
                Ofertas recibidas ({offers.length})
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setSortBy("price")}
                  className={`px-3 py-1 rounded-lg mr-1 ${
                    sortBy === "price" ? "bg-primary" : "bg-surface-tertiary"
                  }`}
                >
                  <Text className={`text-xs ${sortBy === "price" ? "text-white" : "text-text-secondary"}`}>
                    Precio
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSortBy("time")}
                  className={`px-3 py-1 rounded-lg ${
                    sortBy === "time" ? "bg-primary" : "bg-surface-tertiary"
                  }`}
                >
                  <Text className={`text-xs ${sortBy === "time" ? "text-white" : "text-text-secondary"}`}>
                    Tiempo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={offers}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item: offer }) => (
                <OfferCard
                  offer={offer}
                  showActions={isBuyer && request.status === "OPEN"}
                  onAccept={() => handleAcceptOffer(offer.id)}
                />
              )}
              ListEmptyComponent={
                <Card className="items-center py-6">
                  <Ionicons name="time-outline" size={32} color="#dbe1ef" />
                  <Text className="text-text-secondary mt-2">
                    Esperando ofertas de vendedores...
                  </Text>
                </Card>
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
