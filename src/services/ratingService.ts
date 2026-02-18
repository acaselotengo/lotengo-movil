import { getDb, saveDb, nextId } from "../db/mockDb";
import { Rating } from "../types";

export async function createRating(
  requestId: string,
  fromUserId: string,
  toUserId: string,
  stars: number,
  comment?: string
): Promise<Rating> {
  const db = getDb();

  const existing = db.ratings.find(
    (r) => r.requestId === requestId && r.fromUserId === fromUserId
  );
  if (existing) throw new Error("Ya calificaste esta transacción");

  const rating: Rating = {
    id: nextId("ratings"),
    requestId,
    fromUserId,
    toUserId,
    stars,
    comment,
    createdAt: new Date().toISOString(),
  };

  db.ratings.push(rating);

  // Update target user's average
  const user = db.users.find((u) => u.id === toUserId);
  if (user) {
    const total = user.ratingAvg * user.ratingCount + stars;
    user.ratingCount += 1;
    user.ratingAvg = Math.round((total / user.ratingCount) * 10) / 10;
  }

  await saveDb();
  return rating;
}

export function getRatingsByRequest(requestId: string): Rating[] {
  return getDb().ratings.filter((r) => r.requestId === requestId);
}

export function hasUserRated(requestId: string, fromUserId: string): boolean {
  return getDb().ratings.some(
    (r) => r.requestId === requestId && r.fromUserId === fromUserId
  );
}

export function getRatingsForUser(userId: string): Rating[] {
  return getDb().ratings.filter((r) => r.toUserId === userId);
}
