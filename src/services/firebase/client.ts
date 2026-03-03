import Constants from "expo-constants";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

type FirebasePublicConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  databaseId?: string;
};

function readConfigFromExpoExtra(): FirebasePublicConfig | undefined {
  const expoConfig = Constants.expoConfig;
  const extra = (expoConfig?.extra ?? {}) as Record<string, unknown>;
  const firebase = extra.firebase as FirebasePublicConfig | undefined;
  return firebase;
}

function readConfig(): FirebasePublicConfig {
  const extraCfg = readConfigFromExpoExtra() ?? {};
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? extraCfg.apiKey,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? extraCfg.authDomain,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? extraCfg.projectId,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? extraCfg.storageBucket,
    messagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? extraCfg.messagingSenderId,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? extraCfg.appId,
    databaseId: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_ID ?? extraCfg.databaseId,
  };
}

function requireString(name: string, value?: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Falta configuración de Firebase (${name}). ` +
        `Configúrala en app.json (expo.extra.firebase.${name}) ` +
        `o en variable EXPO_PUBLIC_FIREBASE_${name.replace(/[A-Z]/g, (m) => `_${m}`).toUpperCase()}.`
    );
  }
  return value;
}

export function getFirebaseApp(): FirebaseApp {
  const cfg = readConfig();
  const projectId = requireString("projectId", cfg.projectId);
  const apiKey = requireString("apiKey", cfg.apiKey);
  const appId = requireString("appId", cfg.appId);

  if (getApps().length > 0) return getApp();

  return initializeApp({
    apiKey,
    authDomain: cfg.authDomain,
    projectId,
    storageBucket: cfg.storageBucket,
    messagingSenderId: cfg.messagingSenderId,
    appId,
  });
}

export function getFirestoreDb(): Firestore {
  const cfg = readConfig();
  const app = getFirebaseApp();
  const databaseId = cfg.databaseId?.trim() || "lotengodb01";
  return getFirestore(app, databaseId);
}

