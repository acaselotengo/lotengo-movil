import { getDb, saveDb, nextId } from "../db/mockDb";
import { Chat, Message, MessageType } from "../types";

export function getChatByRequest(requestId: string): Chat | undefined {
  return getDb().chats.find((c) => c.requestId === requestId);
}

export function getChatById(chatId: string): Chat | undefined {
  return getDb().chats.find((c) => c.id === chatId);
}

export function getChatsByUser(userId: string): Chat[] {
  const db = getDb();

  // Pre-index last message per chat to avoid N+1
  const lastMessageByChat = new Map<string, Message>();
  for (const m of db.messages) {
    const existing = lastMessageByChat.get(m.chatId);
    if (!existing || new Date(m.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
      lastMessageByChat.set(m.chatId, m);
    }
  }

  return db.chats
    .filter((c) => c.buyerId === userId || c.sellerId === userId)
    .sort((a, b) => {
      const aLast = lastMessageByChat.get(a.id);
      const bLast = lastMessageByChat.get(b.id);
      const aTime = aLast ? new Date(aLast.createdAt).getTime() : new Date(a.createdAt).getTime();
      const bTime = bLast ? new Date(bLast.createdAt).getTime() : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
}

export function getMessages(chatId: string): Message[] {
  return getDb()
    .messages.filter((m) => m.chatId === chatId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getLastMessage(chatId: string): Message | undefined {
  const msgs = getDb().messages.filter((m) => m.chatId === chatId);
  if (msgs.length === 0) return undefined;
  return msgs.reduce((latest, m) =>
    new Date(m.createdAt).getTime() > new Date(latest.createdAt).getTime() ? m : latest
  );
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  type: MessageType,
  content: { text?: string; uri?: string; fileName?: string }
): Promise<Message> {
  const db = getDb();
  const msg: Message = {
    id: nextId("messages"),
    chatId,
    senderId,
    type,
    text: content.text,
    uri: content.uri,
    fileName: content.fileName,
    createdAt: new Date().toISOString(),
  };

  db.messages.push(msg);

  // Notify other user
  const chat = db.chats.find((c) => c.id === chatId);
  if (chat) {
    const recipientId = chat.buyerId === senderId ? chat.sellerId : chat.buyerId;
    db.notifications.push({
      id: nextId("notifications"),
      userId: recipientId,
      type: "NEW_MESSAGE",
      title: "Nuevo mensaje",
      body: type === "text" ? content.text || "Mensaje nuevo" : "Imagen adjunta",
      payload: { chatId },
      createdAt: new Date().toISOString(),
      read: false,
    });
  }

  await saveDb();
  return msg;
}
