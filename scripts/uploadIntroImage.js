/**
 * uploadIntroImage.js
 * -------------------
 * Sube la imagen intro.png a Firebase Storage y actualiza la sección
 * "intro" de appSections en Firestore con la URL.
 *
 * Uso (desde la raíz del proyecto):
 *   node scripts/uploadIntroImage.js
 *
 * Requiere: firebase-admin, misma service account que seedFirebase.js
 */

const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");
const fs = require("fs");

// ─── Config ────────────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = path.join(
  __dirname,
  "..",
  "LoTengoApp",
  "lotengo-app-7a801-firebase-adminsdk-fbsvc-35fb008c43.json"
);
const DATABASE_ID = "lotengodb01";
const INTRO_IMAGE_PATH = path.join(__dirname, "..", "LoTengoApp", "images", "intro.png");
const STORAGE_PATH = "app/intro/intro.png";

// ─── Init ──────────────────────────────────────────────────────────────────

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore(DATABASE_ID);
// Usa el bucket por defecto del proyecto (debe estar Storage habilitado en Firebase Console)
const bucket = admin.storage().bucket(serviceAccount.project_id + ".appspot.com");

// ─── Actualizar Firestore appSections/intro ────────────────────────────────

async function updateIntroSection(imageUrl, title, subtitle) {
  const introRef = db.collection("appSections").doc("intro");
  const introSnap = await introRef.get();
  if (!introSnap.exists) {
    throw new Error("No existe el documento appSections/intro. Ejecuta antes scripts/seedFirebase.js");
  }
  const intro = introSnap.data();
  const items = [...(intro.items || [])];
  const intro1Index = items.findIndex((i) => i.id === "intro1");
  if (intro1Index === -1) {
    throw new Error("No se encontró el ítem intro1 en appSections/intro");
  }
  items[intro1Index] = {
    ...items[intro1Index],
    imageUrl,
    title: title || "Lo que buscas, está más cerca de lo que crees.",
    subtitle: subtitle || "Publica. Recibe ofertas. Compra local.",
  };
  await introRef.update({
    items,
    updatedAt: new Date().toISOString(),
  });
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🖼️  Imagen de intro → appSections/intro\n");

  if (!fs.existsSync(INTRO_IMAGE_PATH)) {
    throw new Error(`No se encontró la imagen: ${INTRO_IMAGE_PATH}`);
  }

  const title = "Lo que buscas, está más cerca de lo que crees.";
  const subtitle = "Publica. Recibe ofertas. Compra local.";

  try {
    // 1. Subir a Storage
    const file = bucket.file(STORAGE_PATH);
    await bucket.upload(INTRO_IMAGE_PATH, {
      destination: STORAGE_PATH,
      metadata: { contentType: "image/png" },
    });
    console.log("  ✓ Imagen subida a Storage:", STORAGE_PATH);

    // 2. Obtener URL (signed URL válida 10 años)
    const [signedUrls] = await file.getSignedUrl({
      action: "read",
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
    });
    const imageUrl = signedUrls[0];
    console.log("  ✓ URL obtenida");

    await updateIntroSection(imageUrl, title, subtitle);
    console.log("  ✓ appSections/intro actualizado con la URL de Storage.\n");
    console.log("✅ Listo. La pantalla de introducción usará la imagen subida.\n");
  } catch (err) {
    if (err.code === 404 || (err.message && err.message.includes("bucket") && err.message.includes("exist"))) {
      console.log("  ⚠ Firebase Storage no está habilitado o el bucket no existe.");
      console.log("  → Actualizando Firestore con imagen local (local:intro).\n");
      await updateIntroSection("local:intro", title, subtitle);
      console.log("  ✓ appSections/intro actualizado con imageUrl: local:intro");
      console.log("\n  En la app, al mostrar el slide intro1, si imageUrl es 'local:intro'");
      console.log("  usa require() de LoTengoApp/images/intro.png.\n");
      console.log("  Para usar Storage: Firebase Console → Build → Storage → Get started");
      console.log("  y vuelve a ejecutar: node scripts/uploadIntroImage.js\n");
    } else {
      throw err;
    }
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
