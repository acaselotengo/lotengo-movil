/**
 * seedFirebase.js
 * ---------------
 * Creates demo users in Firebase Authentication and seeds the
 * "lotengodb01" Firestore database with initial data.
 *
 * Usage (from project root):
 *   node scripts/seedFirebase.js
 *
 * Requirements:
 *   - firebase-admin installed (npm install firebase-admin --save-dev)
 *   - Service account key at the path below
 */

const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

// ─── Config ────────────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = path.join(
  __dirname,
  "..",
  "LoTengoApp",
  "lotengo-app-7a801-firebase-adminsdk-fbsvc-35fb008c43.json"
);
const DATABASE_ID = "lotengodb01";

// ─── Init ──────────────────────────────────────────────────────────────────

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore(DATABASE_ID);
const auth = admin.auth();

// ─── Demo Data ─────────────────────────────────────────────────────────────

const USERS = [
  {
    uid: "u1",
    email: "alex@demo.com",
    password: "demo1234",
    displayName: "Alex Rivera",
    profile: {
      role: "buyer",
      name: "Alex Rivera",
      phone: "300 123 4567",
      email: "alex@demo.com",
      createdAt: "2026-01-15T10:00:00Z",
      ratingAvg: 4.5,
      ratingCount: 2,
      department: "Meta",
      city: "Villavicencio",
      address: "Conjunto Los Cerezos, casa 186 Alborada",
      location: {
        lat: 4.142,
        lng: -73.6266,
        address: "Conjunto Los Cerezos, Villavicencio",
      },
    },
  },
  {
    uid: "u2",
    email: "maria@demo.com",
    password: "demo1234",
    displayName: "María López",
    profile: {
      role: "seller",
      name: "María López",
      phone: "310 987 6543",
      email: "maria@demo.com",
      createdAt: "2026-01-10T08:00:00Z",
      ratingAvg: 4.8,
      ratingCount: 5,
      department: "Antioquia",
      city: "Medellín",
      address: "Calle 10 #32-15",
      businessName: "Distribuidora María",
      location: {
        lat: 6.2442,
        lng: -75.5812,
        address: "Calle 10 #32-15, Medellín",
      },
    },
  },
  {
    uid: "u3",
    email: "carlos@demo.com",
    password: "demo1234",
    displayName: "Carlos Gómez",
    profile: {
      role: "seller",
      name: "Carlos Gómez",
      phone: "320 555 1234",
      email: "carlos@demo.com",
      createdAt: "2026-01-12T09:00:00Z",
      ratingAvg: 4.2,
      ratingCount: 3,
      department: "Antioquia",
      city: "Envigado",
      address: "Carrera 27 #38S-70",
      businessName: "TecnoCarlos",
      location: {
        lat: 6.1709,
        lng: -75.583,
        address: "Carrera 27 #38S-70, Envigado",
      },
    },
  },
  {
    uid: "u4",
    email: "laura@demo.com",
    password: "demo1234",
    displayName: "Laura Martínez",
    profile: {
      role: "seller",
      name: "Laura Martínez",
      phone: "315 222 3333",
      email: "laura@demo.com",
      createdAt: "2026-01-14T11:00:00Z",
      ratingAvg: 4.6,
      ratingCount: 4,
      department: "Antioquia",
      city: "Medellín",
      address: "Avenida 80 #25-10",
      businessName: "Laura's Store",
      location: {
        lat: 6.2518,
        lng: -75.5936,
        address: "Avenida 80 #25-10, Medellín",
      },
    },
  },
];

const PRODUCTS = [
  {
    id: "p1",
    sellerId: "u2",
    name: "Cerveza Corona x12",
    category: "Comida",
    priceBase: 45000,
    etaValue: 30,
    etaUnit: "min",
    notes: "Incluye hielo sin costo",
    images: [],
    createdAt: "2026-01-16T10:00:00Z",
  },
  {
    id: "p2",
    sellerId: "u2",
    name: "Whisky Johnnie Walker",
    category: "Comida",
    priceBase: 120000,
    etaValue: 1,
    etaUnit: "hours",
    images: [],
    createdAt: "2026-01-16T10:05:00Z",
  },
  {
    id: "p3",
    sellerId: "u3",
    name: "Smartphone Ultra X",
    category: "Electrónica",
    priceBase: 895000,
    etaValue: 2,
    etaUnit: "days",
    images: [],
    createdAt: "2026-01-17T10:00:00Z",
  },
  {
    id: "p4",
    sellerId: "u3",
    name: "Silla Pro Ergo",
    category: "Hogar",
    priceBase: 145000,
    etaValue: 3,
    etaUnit: "days",
    images: [],
    createdAt: "2026-01-17T10:05:00Z",
  },
  {
    id: "p5",
    sellerId: "u4",
    name: "Lámpara Nórdica",
    category: "Hogar",
    priceBase: 85000,
    etaValue: 1,
    etaUnit: "days",
    images: [],
    createdAt: "2026-01-18T10:00:00Z",
  },
  {
    id: "p6",
    sellerId: "u4",
    name: "Audífonos Beats",
    category: "Electrónica",
    priceBase: 310000,
    etaValue: 2,
    etaUnit: "days",
    images: [],
    createdAt: "2026-01-18T10:05:00Z",
  },
  {
    id: "p7",
    sellerId: "u4",
    name: "Café de Origen Huila",
    category: "Comida",
    priceBase: 35000,
    etaValue: 30,
    etaUnit: "min",
    images: [],
    createdAt: "2026-01-18T10:10:00Z",
  },
];

const REQUESTS = [
  {
    id: "r1",
    buyerId: "u1",
    title: "Cerveza Corona x12",
    description: "Necesito cerveza Corona caja de 12 unidades bien fría",
    quantity: 12,
    unit: "unidades",
    notes: "Entrega en portería, llamar al llegar",
    category: "Comida",
    location: {
      lat: 6.2442,
      lng: -75.5812,
      address: "Carrera 43A #1-50, Medellín",
    },
    status: "OPEN",
    createdAt: "2026-02-01T14:00:00Z",
  },
  {
    id: "r2",
    buyerId: "u1",
    title: "Reparación Pantalla iPhone 13",
    description: "Pantalla rota, necesito reparación urgente",
    quantity: 1,
    unit: "servicio",
    category: "Servicios",
    location: {
      lat: 6.25,
      lng: -75.57,
      address: "Centro Comercial Santafé",
    },
    status: "OPEN",
    createdAt: "2026-02-02T10:00:00Z",
  },
];

const OFFERS = [
  {
    id: "o1",
    requestId: "r1",
    sellerId: "u2",
    price: 42000,
    etaValue: 25,
    etaUnit: "min",
    notes: "Incluye hielo y bolsa térmica",
    attachments: [],
    status: "SUBMITTED",
    createdAt: "2026-02-01T14:30:00Z",
  },
  {
    id: "o2",
    requestId: "r1",
    sellerId: "u4",
    price: 48000,
    etaValue: 40,
    etaUnit: "min",
    notes: "Entrega directa desde proveedor",
    attachments: [],
    status: "SUBMITTED",
    createdAt: "2026-02-01T15:00:00Z",
  },
  {
    id: "o3",
    requestId: "r2",
    sellerId: "u3",
    price: 180000,
    etaValue: 2,
    etaUnit: "hours",
    notes: "Garantía de 3 meses en la reparación",
    attachments: [],
    status: "SUBMITTED",
    createdAt: "2026-02-02T10:30:00Z",
  },
];

// ─── App Sections ──────────────────────────────────────────────────────────

const APP_SECTIONS = [
  // ── Header banners (carrusel principal) ─────────────────────────────────
  {
    id: "header_banners",
    type: "header_banners",
    title: "Banners del Header",
    active: true,
    updatedAt: "2026-02-01T00:00:00Z",
    items: [
      {
        id: "b1",
        imageUrl: "https://placehold.co/800x320/ef741c/ffffff?text=Lo+Tengo",
        title: "¡Pide lo que necesitas!",
        subtitle: "Vendedores cerca de ti responden al instante",
        linkType: "none",
        order: 1,
        active: true,
      },
      {
        id: "b2",
        imageUrl: "https://placehold.co/800x320/ad3020/ffffff?text=Ofertas",
        title: "Recibe ofertas en minutos",
        subtitle: "Compara precios y elige la mejor opción",
        linkType: "none",
        order: 2,
        active: true,
      },
      {
        id: "b3",
        imageUrl: "https://placehold.co/800x320/33559a/ffffff?text=Electrónica",
        title: "Electrónica al mejor precio",
        subtitle: "Vendedores verificados en tu ciudad",
        linkType: "category",
        linkValue: "Electrónica",
        order: 3,
        active: true,
      },
    ],
  },

  // ── Categories (grid en home del comprador) ──────────────────────────────
  {
    id: "categories",
    type: "categories",
    title: "Categorías",
    active: true,
    updatedAt: "2026-02-01T00:00:00Z",
    items: [
      {
        id: "cat1",
        name: "Electrónica",
        icon: "laptop-outline",
        color: "#33559a",
        order: 1,
        active: true,
      },
      {
        id: "cat2",
        name: "Comida",
        icon: "fast-food-outline",
        color: "#ef741c",
        order: 2,
        active: true,
      },
      {
        id: "cat3",
        name: "Servicios",
        icon: "construct-outline",
        color: "#94cc1c",
        order: 3,
        active: true,
      },
      {
        id: "cat4",
        name: "Hogar",
        icon: "home-outline",
        color: "#ad3020",
        order: 4,
        active: true,
      },
      {
        id: "cat5",
        name: "Moda",
        icon: "shirt-outline",
        color: "#8694b8",
        order: 5,
        active: true,
      },
      {
        id: "cat6",
        name: "Otro",
        icon: "grid-outline",
        color: "#2a2c7c",
        order: 6,
        active: true,
      },
    ],
  },

  // ── Promotions (sección de promociones) ─────────────────────────────────
  {
    id: "promotions",
    type: "promotions",
    title: "Promociones",
    active: true,
    updatedAt: "2026-02-01T00:00:00Z",
    items: [
      {
        id: "promo1",
        imageUrl: "https://placehold.co/700x280/94cc1c/ffffff?text=Envío+Gratis",
        title: "Envío gratis esta semana",
        subtitle: "En pedidos de comida mayores a $30.000",
        badgeText: "GRATIS",
        linkType: "category",
        linkValue: "Comida",
        validUntil: "2026-03-31T23:59:59Z",
        order: 1,
        active: true,
      },
      {
        id: "promo2",
        imageUrl: "https://placehold.co/700x280/2a2c7c/ffffff?text=Tech+Sale",
        title: "Tech Sale — Hasta 20% OFF",
        subtitle: "Vendedores de electrónica con descuentos especiales",
        badgeText: "20% OFF",
        linkType: "category",
        linkValue: "Electrónica",
        validUntil: "2026-04-15T23:59:59Z",
        order: 2,
        active: true,
      },
      {
        id: "promo3",
        imageUrl: "https://placehold.co/700x280/ef741c/ffffff?text=Servicios",
        title: "¿Necesitas un servicio?",
        subtitle: "Técnicos, plomeros, electricistas y más",
        linkType: "category",
        linkValue: "Servicios",
        order: 3,
        active: true,
      },
    ],
  },

  // ── Intro / Onboarding ───────────────────────────────────────────────────
  {
    id: "intro",
    type: "intro",
    title: "Pantalla de Introducción",
    active: true,
    updatedAt: "2026-02-01T00:00:00Z",
    items: [
      {
        id: "intro1",
        imageUrl: "https://placehold.co/800x600/ad3020/ffffff?text=Bienvenido",
        title: "Bienvenido a Lo Tengo",
        subtitle: "La forma más rápida de encontrar lo que necesitas cerca de ti",
        order: 1,
        active: true,
      },
      {
        id: "intro2",
        imageUrl: "https://placehold.co/800x600/33559a/ffffff?text=Solicita",
        title: "Publica tu solicitud",
        subtitle: "Describe lo que necesitas y recibe ofertas de vendedores en minutos",
        order: 2,
        active: true,
      },
      {
        id: "intro3",
        imageUrl: "https://placehold.co/800x600/94cc1c/2a2c7c?text=Compara",
        title: "Compara y elige",
        subtitle: "Revisa precio, tiempo de entrega y calificaciones antes de decidir",
        order: 3,
        active: true,
      },
      {
        id: "intro4",
        imageUrl: "https://placehold.co/800x600/ef741c/ffffff?text=Listo",
        title: "¡Coordina y recibe!",
        subtitle: "Chatea directamente con el vendedor y acuerda la entrega",
        order: 4,
        active: true,
      },
    ],
  },

  // ── Loader / Splash ──────────────────────────────────────────────────────
  {
    id: "loader",
    type: "loader",
    title: "Pantalla de Carga",
    active: true,
    updatedAt: "2026-02-01T00:00:00Z",
    items: [
      {
        id: "loader1",
        backgroundColor: "#ffffff",
        tagline: "Cargando...",
        animationType: "pulse",
        order: 1,
        active: true,
      },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

async function createAuthUser(u) {
  try {
    await auth.createUser({
      uid: u.uid,
      email: u.email,
      password: u.password,
      displayName: u.displayName,
      emailVerified: true,
    });
    console.log(`  ✓ Auth user created: ${u.email} (uid: ${u.uid})`);
  } catch (err) {
    if (err.code === "auth/uid-already-exists" || err.code === "auth/email-already-exists") {
      console.log(`  ~ Auth user already exists: ${u.email}`);
    } else {
      throw err;
    }
  }
}

async function seedCollection(collectionName, items) {
  const batch = db.batch();
  for (const item of items) {
    const { id, ...data } = item;
    const ref = db.collection(collectionName).doc(id);
    batch.set(ref, data, { merge: true });
  }
  await batch.commit();
  console.log(`  ✓ ${collectionName}: ${items.length} documents seeded`);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔥 LoTengo Firebase Seed Script");
  console.log(`   Database: ${DATABASE_ID}\n`);

  // 1. Firebase Authentication
  console.log("1. Creating Firebase Auth users...");
  for (const user of USERS) {
    await createAuthUser(user);
  }

  // 2. Firestore - Users profiles
  console.log("\n2. Seeding Firestore collections...");
  const userDocs = USERS.map((u) => ({ id: u.uid, ...u.profile }));
  await seedCollection("users", userDocs);

  // 3. Products
  await seedCollection("products", PRODUCTS);

  // 4. Requests
  await seedCollection("requests", REQUESTS);

  // 5. Offers
  await seedCollection("offers", OFFERS);

  // 6. App Sections
  await seedCollection("appSections", APP_SECTIONS);

  console.log("\n✅ Seed completed successfully!");
  console.log("\nDemo credentials:");
  console.log("  Buyer : alex@demo.com   / demo1234");
  console.log("  Seller: maria@demo.com  / demo1234");
  console.log("  Seller: carlos@demo.com / demo1234");
  console.log("  Seller: laura@demo.com  / demo1234\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
