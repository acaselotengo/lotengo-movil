import { getDb, saveDb, nextId } from "../db/mockDb";
import { Request, RequestStatus, Location } from "../types";
import { collection, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { getFirestoreDb } from "./firebase/client";

export interface CreateRequestData {
  buyerId: string;
  title: string;
  description?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  category?: string;
  location: Location;
}

export async function createRequest(data: CreateRequestData): Promise<Request> {
  const db = getDb();
  const req: Request = {
    id: nextId("requests"),
    buyerId: data.buyerId,
    title: data.title,
    description: data.description,
    quantity: data.quantity,
    unit: data.unit,
    notes: data.notes,
    category: data.category,
    location: data.location,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  // 1) Persist in Firestore (real Firebase)
  const firestoreDb = getFirestoreDb();
  await setDoc(doc(firestoreDb, "requests", req.id), {
    buyerId: req.buyerId,
    title: req.title,
    description: req.description,
    quantity: req.quantity,
    unit: req.unit,
    notes: req.notes,
    category: req.category,
    location: req.location,
    status: req.status,
    createdAt: req.createdAt,
  });

  // 2) Broadcast notifications to all sellers (non-blocking)
  try {
    const sellersSnap = await getDocs(
      query(collection(firestoreDb, "users"), where("role", "==", "seller"))
    );

    if (!sellersSnap.empty) {
      const batch = writeBatch(firestoreDb);
      for (const sellerDoc of sellersSnap.docs) {
        const notifRef = doc(collection(firestoreDb, "notifications"));
        batch.set(notifRef, {
          userId: sellerDoc.id,
          type: "NEW_REQUEST",
          title: "Nueva solicitud",
          body: `"${req.title}" - Nuevo pedido disponible`,
          payload: { requestId: req.id },
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
      await batch.commit();
    }
  } catch (notifError) {
    console.warn("[requestService] Notification broadcast failed:", notifError);
  }

  // Keep local mock DB in sync for the current UI
  db.requests.push(req);

  // Broadcast: create notifications for all sellers
  const sellers = db.users.filter((u) => u.role === "seller");
  for (const seller of sellers) {
    db.notifications.push({
      id: nextId("notifications"),
      userId: seller.id,
      type: "NEW_REQUEST",
      title: "Nueva solicitud",
      body: `"${req.title}" - Nuevo pedido disponible`,
      payload: { requestId: req.id },
      createdAt: new Date().toISOString(),
      read: false,
    });
  }

  await saveDb();
  return req;
}

export function getRequestById(id: string): Request | undefined {
  return getDb().requests.find((r) => r.id === id);
}

export function getRequestsByBuyer(buyerId: string): Request[] {
  return getDb()
    .requests.filter((r) => r.buyerId === buyerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOpenRequests(): Request[] {
  return getDb()
    .requests.filter((r) => r.status === "OPEN")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllRequests(): Request[] {
  return getDb()
    .requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
  acceptedOfferId?: string
): Promise<void> {
  const db = getDb();
  const req = db.requests.find((r) => r.id === requestId);
  if (!req) throw new Error("Solicitud no encontrada");
  req.status = status;
  if (acceptedOfferId) req.acceptedOfferId = acceptedOfferId;
  await saveDb();
}
