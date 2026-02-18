import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "../types";
import { seedDb } from "./seedDb";

const DB_KEY = "@lotengo_db";

let db: Database = structuredClone(seedDb);

export function getDb(): Database {
  return db;
}

export async function loadDb(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(DB_KEY);
    if (raw) {
      db = JSON.parse(raw);
    } else {
      db = structuredClone(seedDb);
      await saveDb();
    }
  } catch {
    db = structuredClone(seedDb);
  }
}

export async function saveDb(): Promise<void> {
  try {
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("Error saving db:", e);
  }
}

export async function resetDb(): Promise<void> {
  db = structuredClone(seedDb);
  await saveDb();
}

export function nextId(tableName: string): string {
  const current = db.counters[tableName] || 0;
  const next = current + 1;
  db.counters[tableName] = next;
  return `${tableName.charAt(0)}${next}`;
}
