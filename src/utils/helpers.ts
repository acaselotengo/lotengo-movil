import { Location, RequestStatus, OfferStatus, EtaUnit } from "../types";

export function formatCOP(amount: number): string {
  return `$${amount.toLocaleString("es-CO")}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    OPEN: "Activa",
    NEGOTIATING: "En negociación",
    CLOSED: "Cerrada",
    ACCEPTED: "Completada",
    CANCELLED: "Cancelada",
  };
  return labels[status];
}

export function getStatusColor(status: RequestStatus): { bg: string; text: string } {
  const colors: Record<RequestStatus, { bg: string; text: string }> = {
    OPEN: { bg: "bg-success-light", text: "text-success" },
    NEGOTIATING: { bg: "bg-secondary-light/20", text: "text-secondary" },
    CLOSED: { bg: "bg-warning-light", text: "text-warning-dark" },
    ACCEPTED: { bg: "bg-success-light", text: "text-success-dark" },
    CANCELLED: { bg: "bg-danger-light", text: "text-danger" },
  };
  return colors[status];
}

export function getOfferStatusLabel(status: OfferStatus): string {
  const labels: Record<OfferStatus, string> = {
    SUBMITTED: "Enviada",
    ACCEPTED: "Aceptada",
    REJECTED: "Rechazada",
    WITHDRAWN: "Retirada",
  };
  return labels[status];
}

export function getOfferStatusColor(status: OfferStatus): { bg: string; text: string } {
  const colors: Record<OfferStatus, { bg: string; text: string }> = {
    SUBMITTED: { bg: "bg-secondary-light/20", text: "text-secondary" },
    ACCEPTED: { bg: "bg-success-light", text: "text-success" },
    REJECTED: { bg: "bg-danger-light", text: "text-danger" },
    WITHDRAWN: { bg: "bg-surface-tertiary", text: "text-text-muted" },
  };
  return colors[status];
}

export function formatEta(value: number, unit: EtaUnit): string {
  const unitLabels: Record<EtaUnit, [string, string]> = {
    min: ["minuto", "minutos"],
    hours: ["hora", "horas"],
    days: ["día", "días"],
  };
  const [singular, plural] = unitLabels[unit];
  return `${value} ${value === 1 ? singular : plural}`;
}

export function calcDistance(from: Location, to: Location): number {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}

export const CATEGORIES = [
  "Electrónica",
  "Comida",
  "Servicios",
  "Hogar",
  "Moda",
  "Otro",
];

export const DEPARTMENTS = [
  "Antioquia",
  "Bogotá D.C.",
  "Valle del Cauca",
  "Cundinamarca",
  "Santander",
  "Atlántico",
  "Bolívar",
  "Nariño",
  "Tolima",
  "Risaralda",
];
