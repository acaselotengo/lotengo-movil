import { getDb, saveDb, nextId } from "../db/mockDb";
import { Offer, OfferStatus, EtaUnit } from "../types";

export interface CreateOfferData {
  requestId: string;
  sellerId: string;
  price: number;
  etaValue: number;
  etaUnit: EtaUnit;
  notes?: string;
  attachments?: string[];
}

export async function createOffer(data: CreateOfferData): Promise<Offer> {
  const db = getDb();

  const existing = db.offers.find(
    (o) => o.requestId === data.requestId && o.sellerId === data.sellerId
  );
  if (existing) throw new Error("Ya enviaste una oferta para esta solicitud");

  const offer: Offer = {
    id: nextId("offers"),
    requestId: data.requestId,
    sellerId: data.sellerId,
    price: data.price,
    etaValue: data.etaValue,
    etaUnit: data.etaUnit,
    notes: data.notes,
    attachments: data.attachments || [],
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
  };

  db.offers.push(offer);

  // Notify buyer
  const request = db.requests.find((r) => r.id === data.requestId);
  if (request) {
    const seller = db.users.find((u) => u.id === data.sellerId);
    db.notifications.push({
      id: nextId("notifications"),
      userId: request.buyerId,
      type: "NEW_OFFER",
      title: "Nueva oferta recibida",
      body: `${seller?.name || "Vendedor"} envió una oferta de $${data.price.toLocaleString()}`,
      payload: { requestId: data.requestId, offerId: offer.id },
      createdAt: new Date().toISOString(),
      read: false,
    });
  }

  await saveDb();
  return offer;
}

export function getOffersByRequest(requestId: string): Offer[] {
  return getDb()
    .offers.filter((o) => o.requestId === requestId)
    .sort((a, b) => a.price - b.price);
}

export function getOffersBySeller(sellerId: string): Offer[] {
  return getDb()
    .offers.filter((o) => o.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOfferById(id: string): Offer | undefined {
  return getDb().offers.find((o) => o.id === id);
}

export async function acceptOffer(offerId: string): Promise<void> {
  const db = getDb();
  const offer = db.offers.find((o) => o.id === offerId);
  if (!offer) throw new Error("Oferta no encontrada");

  offer.status = "ACCEPTED";

  // Reject other offers
  db.offers
    .filter((o) => o.requestId === offer.requestId && o.id !== offerId)
    .forEach((o) => (o.status = "REJECTED"));

  // Update request
  const request = db.requests.find((r) => r.id === offer.requestId);
  if (request) {
    request.status = "NEGOTIATING";
    request.acceptedOfferId = offerId;
  }

  // Create chat
  if (request) {
    const chatId = nextId("chats");
    db.chats.push({
      id: chatId,
      requestId: offer.requestId,
      buyerId: request.buyerId,
      sellerId: offer.sellerId,
      createdAt: new Date().toISOString(),
    });

    // System message
    db.messages.push({
      id: nextId("messages"),
      chatId,
      senderId: "system",
      type: "text",
      text: "Oferta aceptada! Ya pueden coordinar la entrega.",
      createdAt: new Date().toISOString(),
    });
  }

  // Notify seller
  db.notifications.push({
    id: nextId("notifications"),
    userId: offer.sellerId,
    type: "OFFER_ACCEPTED",
    title: "Tu oferta fue aceptada!",
    body: `Tu oferta para "${request?.title}" fue aceptada`,
    payload: { requestId: offer.requestId, offerId },
    createdAt: new Date().toISOString(),
    read: false,
  });

  await saveDb();
}

export function hasSellerOfferedOnRequest(
  sellerId: string,
  requestId: string
): boolean {
  return getDb().offers.some(
    (o) => o.sellerId === sellerId && o.requestId === requestId
  );
}

/** Pre-compute Set of requestIds the seller has offered on — O(n) instead of O(n*m) */
export function getSellerOfferedRequestIds(sellerId: string): Set<string> {
  return new Set(
    getDb()
      .offers.filter((o) => o.sellerId === sellerId)
      .map((o) => o.requestId)
  );
}
