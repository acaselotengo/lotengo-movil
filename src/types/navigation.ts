import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OtpVerify: { email: string };
};

// Buyer Tab Navigator
export type BuyerTabParamList = {
  Inicio: undefined;
  Solicitudes: undefined;
  Mensajes: undefined;
  Perfil: undefined;
};

// Seller Tab Navigator
export type SellerTabParamList = {
  Alertas: undefined;
  Mapa: undefined;
  Ofertas: undefined;
  "Catálogo": undefined;
  Perfil: undefined;
};

// Buyer Root Stack
export type BuyerStackParamList = {
  BuyerMain: NavigatorScreenParams<BuyerTabParamList>;
  CreateRequest: undefined;
  RequestDetail: { requestId: string };
  Chat: { chatId: string };
  ChangePassword: undefined;
};

// Seller Root Stack
export type SellerStackParamList = {
  SellerMain: NavigatorScreenParams<SellerTabParamList>;
  SellerRequestDetail: { requestId: string };
  SendOffer: { requestId: string };
  AddProduct: undefined;
  Chat: { chatId: string };
  ChangePassword: undefined;
};

// Screen prop types - Auth
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, "Register">;
export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;
export type OtpVerifyScreenProps = NativeStackScreenProps<AuthStackParamList, "OtpVerify">;

// Screen prop types - Buyer (composite: tab inside stack)
export type BuyerHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BuyerTabParamList, "Inicio">,
  NativeStackScreenProps<BuyerStackParamList>
>;
export type MyRequestsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BuyerTabParamList, "Solicitudes">,
  NativeStackScreenProps<BuyerStackParamList>
>;

// Screen prop types - Seller (composite: tab inside stack)
export type SellerAlertsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<SellerTabParamList, "Alertas">,
  NativeStackScreenProps<SellerStackParamList>
>;
export type SellerMapScreenProps = CompositeScreenProps<
  BottomTabScreenProps<SellerTabParamList, "Mapa">,
  NativeStackScreenProps<SellerStackParamList>
>;
export type MyOffersScreenProps = CompositeScreenProps<
  BottomTabScreenProps<SellerTabParamList, "Ofertas">,
  NativeStackScreenProps<SellerStackParamList>
>;
export type CatalogScreenProps = CompositeScreenProps<
  BottomTabScreenProps<SellerTabParamList, "Catálogo">,
  NativeStackScreenProps<SellerStackParamList>
>;

// Screen prop types - Buyer Stack screens
export type CreateRequestScreenProps = NativeStackScreenProps<BuyerStackParamList, "CreateRequest">;
export type RequestDetailScreenProps = NativeStackScreenProps<BuyerStackParamList, "RequestDetail">;

// Screen prop types - Seller Stack screens
export type SellerRequestDetailScreenProps = NativeStackScreenProps<SellerStackParamList, "SellerRequestDetail">;
export type SendOfferScreenProps = NativeStackScreenProps<SellerStackParamList, "SendOffer">;
export type AddProductScreenProps = NativeStackScreenProps<SellerStackParamList, "AddProduct">;

// Screen prop types - Shared (used in both stacks)
export type ChatScreenProps = NativeStackScreenProps<BuyerStackParamList, "Chat">;
export type ChangePasswordScreenProps = NativeStackScreenProps<BuyerStackParamList, "ChangePassword">;

// Profile is in tabs of both buyer and seller
export type BuyerProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BuyerTabParamList, "Perfil">,
  NativeStackScreenProps<BuyerStackParamList>
>;
export type SellerProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<SellerTabParamList, "Perfil">,
  NativeStackScreenProps<SellerStackParamList>
>;
export type ChatsListScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BuyerTabParamList, "Mensajes">,
  NativeStackScreenProps<BuyerStackParamList>
>;
