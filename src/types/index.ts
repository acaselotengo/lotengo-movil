export type UserRole = "buyer" | "seller";

export type RequestStatus = "OPEN" | "NEGOTIATING" | "CLOSED" | "ACCEPTED" | "CANCELLED";

export type OfferStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export type MessageType = "text" | "image" | "file";

export type NotificationType =
  | "NEW_REQUEST"
  | "NEW_OFFER"
  | "OFFER_ACCEPTED"
  | "OFFER_REJECTED"
  | "REQUEST_CLOSED"
  | "REQUEST_ACCEPTED"
  | "NEW_MESSAGE";

export type EtaUnit = "min" | "hours" | "days";

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
  ratingAvg: number;
  ratingCount: number;
  location?: Location;
  department?: string;
  city?: string;
  address?: string;
  businessName?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  category: string;
  priceBase?: number;
  etaValue?: number;
  etaUnit?: EtaUnit;
  notes?: string;
  conditions?: string;
  images: string[];
  createdAt: string;
}

export interface Request {
  id: string;
  buyerId: string;
  title: string;
  description?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  category?: string;
  location: Location;
  status: RequestStatus;
  createdAt: string;
  acceptedOfferId?: string;
}

export interface Offer {
  id: string;
  requestId: string;
  sellerId: string;
  price: number;
  etaValue: number;
  etaUnit: EtaUnit;
  notes?: string;
  attachments?: string[];
  status: OfferStatus;
  createdAt: string;
}

export interface Chat {
  id: string;
  requestId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  text?: string;
  uri?: string;
  fileName?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  requestId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export interface PasswordReset {
  id: string;
  email: string;
  otpCode: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  payload: Record<string, string>;
  createdAt: string;
  read: boolean;
}

export interface Database {
  users: User[];
  products: Product[];
  requests: Request[];
  offers: Offer[];
  chats: Chat[];
  messages: Message[];
  ratings: Rating[];
  passwordResets: PasswordReset[];
  notifications: Notification[];
  counters: Record<string, number>;
}
