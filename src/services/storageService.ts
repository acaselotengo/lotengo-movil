import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getFirebaseApp } from "./firebase/client";

const OFFER_IMAGES_PREFIX = "offerImages";

/**
 * Sube hasta 3 imágenes a Firebase Storage y devuelve sus URLs públicas.
 * Usa fetch(localUri) para obtener un Blob nativo compatible con React Native.
 */
export async function uploadOfferImages(imageUris: string[]): Promise<string[]> {
  if (imageUris.length === 0) return [];
  const app = getFirebaseApp();
  const storage = getStorage(app);
  const urls: string[] = [];
  const timestamp = Date.now();

  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i];
    const shortId = Math.random().toString(36).slice(2, 10);

    const response = await fetch(uri);
    const blob = await response.blob();

    const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
    const path = `${OFFER_IMAGES_PREFIX}/${timestamp}_${i}_${shortId}.${ext}`;
    const storageRef = ref(storage, path);

    await new Promise<void>((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, blob);
      task.on("state_changed", null, reject, () => resolve());
    });

    const downloadUrl = await getDownloadURL(storageRef);
    urls.push(downloadUrl);
  }

  return urls;
}
