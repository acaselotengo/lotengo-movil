import { SellerRequestDetailScreenProps } from "../../types/navigation";
import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../components/ui/AppHeader";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";
import RatingStars from "../../components/ui/RatingStars";
import TextField from "../../components/ui/TextField";
import { useAuthStore } from "../../store/authStore";
import { getRequestById } from "../../services/requestService";
import { hasSellerOfferedOnRequest, getOffersByRequest, getOfferById } from "../../services/offerService";
import { getChatByRequest } from "../../services/chatService";
import { hasUserRated, createRating } from "../../services/ratingService";
import { getUserById } from "../../services/authService";
import { formatDate, getStatusLabel, getStatusColor } from "../../utils/helpers";
import { Request, Chat } from "../../types";

export default function SellerRequestDetailScreen({ route, navigation }: SellerRequestDetailScreenProps) {
  const { requestId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [request, setRequest] = useState<Request | undefined>();
  const [alreadyOffered, setAlreadyOffered] = useState(false);
  const [chat, setChat] = useState<Chat | undefined>();
  const [ratingStars, setRatingStarsVal] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [, setRefresh] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const req = getRequestById(requestId);
      setRequest(req);
      if (user) {
        setAlreadyOffered(hasSellerOfferedOnRequest(user.id, requestId));
        const c = getChatByRequest(requestId);
        if (c && (c.sellerId === user.id)) {
          setChat(c);
        }
        if (req) {
          setAlreadyRated(hasUserRated(requestId, user.id));
        }
      }
    }, [requestId, user])
  );

  if (!request) return null;

  const buyer = getUserById(request.buyerId);
  const { bg: statusBg, text: statusText } = getStatusColor(request.status);

  const myOffer = user
    ? getOffersByRequest(requestId).find((o) => o.sellerId === user.id)
    : undefined;

  const handleRate = async () => {
    if (ratingStars === 0 || !user || !buyer) return;
    try {
      await createRating(requestId, user.id, buyer.id, ratingStars, ratingComment);
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
            <Text className="text-sm text-text-secondary mt-1">Nota: {request.notes}</Text>
          )}

          {buyer && (
            <View className="flex-row items-center mt-3 pt-3 border-t border-border-light">
              <Ionicons name="person-circle-outline" size={20} color="#8694b8" />
              <Text className="text-sm text-text-secondary ml-2">
                Comprador: {buyer.name}
              </Text>
            </View>
          )}
        </Card>

        {myOffer && (
          <Card className={`mt-3 border-l-4 ${
            myOffer.status === "ACCEPTED" ? "border-l-success" :
            myOffer.status === "REJECTED" ? "border-l-danger" : "border-l-primary"
          }`}>
            <Text className="text-sm font-semibold text-text-primary mb-1">
              Tu oferta: {myOffer.status === "ACCEPTED" ? "¡Aceptada!" :
                         myOffer.status === "REJECTED" ? "Rechazada" : "Enviada"}
            </Text>
            <Text className="text-sm text-text-secondary">
              Precio: ${myOffer.price.toLocaleString()} · {myOffer.etaValue} {myOffer.etaUnit}
            </Text>
          </Card>
        )}

        {chat && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
            className="bg-primary rounded-xl py-3 mt-3 flex-row items-center justify-center"
          >
            <Ionicons name="chatbubbles" size={18} color="#fff" />
            <Text className="text-white font-semibold ml-2">Ir al Chat</Text>
          </TouchableOpacity>
        )}

        {request.status === "OPEN" && !alreadyOffered && (
          <PrimaryButton
            title="Participar - Enviar Oferta"
            onPress={() =>
              navigation.navigate("SendOffer", { requestId: request.id })
            }
            variant="accent"
            className="mt-4"
            icon={<Ionicons name="send" size={16} color="#fff" />}
          />
        )}

        {request.status === "ACCEPTED" && myOffer?.status === "ACCEPTED" && !alreadyRated && (
          <Card className="mt-4">
            <Text className="text-base font-bold text-text-primary mb-2">
              Califica al comprador
            </Text>
            <RatingStars rating={ratingStars} size={32} interactive onChange={setRatingStarsVal} />
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
      </ScrollView>
    </View>
  );
}
