import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { getRequestsByBuyer } from "../../services/requestService";
import { getOffersByRequest } from "../../services/offerService";
import RequestCard from "../../components/cards/RequestCard";
import SegmentedControl from "../../components/ui/SegmentedControl";
import AppHeader from "../../components/ui/AppHeader";
import EmptyState from "../../components/ui/EmptyState";
import { Request, RequestStatus } from "../../types";
import { MyRequestsScreenProps } from "../../types/navigation";

const TABS = ["Todas", "Activas", "En negociación", "Completadas"];

function getFilter(tab: string): RequestStatus[] {
  switch (tab) {
    case "Activas":
      return ["OPEN"];
    case "En negociación":
      return ["NEGOTIATING", "CLOSED"];
    case "Completadas":
      return ["ACCEPTED"];
    default:
      return ["OPEN", "NEGOTIATING", "CLOSED", "ACCEPTED", "CANCELLED"];
  }
}

type EnrichedRequest = { request: Request; offerCount: number };

export default function MyRequestsScreen({ navigation }: MyRequestsScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [requests, setRequests] = useState<Request[]>([]);
  const [tab, setTab] = useState("Todas");

  useFocusEffect(
    useCallback(() => {
      if (user) setRequests(getRequestsByBuyer(user.id));
    }, [user?.id])
  );

  const statuses = getFilter(tab);
  const filtered = useMemo(
    () =>
      requests
        .filter((r) => statuses.includes(r.status))
        .map((r) => ({ request: r, offerCount: getOffersByRequest(r.id).length })),
    [requests, statuses]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: EnrichedRequest; index: number }) => (
      <RequestCard
        request={item.request}
        offerCount={item.offerCount}
        onPress={() =>
          navigation.navigate("RequestDetail", { requestId: item.request.id })
        }
        index={index}
      />
    ),
    [navigation]
  );

  return (
    <View className="flex-1 bg-bg-light">
      <AppHeader title="Mis Solicitudes" />
      <View className="px-4 pt-3">
        <SegmentedControl options={TABS} selected={tab} onSelect={setTab} />
      </View>
      <FlatList
        className="flex-1 px-4"
        data={filtered}
        keyExtractor={(item) => item.request.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Sin solicitudes"
            subtitle="No hay solicitudes en esta categoría."
            iconColor="#ad3020"
            iconBgColor="bg-primary/10"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
