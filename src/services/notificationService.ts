import { getDb, saveDb } from "../db/mockDb";
import { Notification } from "../types";

export function getNotifications(userId: string): Notification[] {
  return getDb()
    .notifications.filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadCount(userId: string): number {
  return getDb().notifications.filter(
    (n) => n.userId === userId && !n.read
  ).length;
}

export async function markAsRead(notificationId: string): Promise<void> {
  const db = getDb();
  const notif = db.notifications.find((n) => n.id === notificationId);
  if (notif) {
    notif.read = true;
    await saveDb();
  }
}

export async function markAllAsRead(userId: string): Promise<void> {
  const db = getDb();
  db.notifications
    .filter((n) => n.userId === userId && !n.read)
    .forEach((n) => (n.read = true));
  await saveDb();
}
