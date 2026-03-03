# LO TENGO — Reverse Marketplace

**LO TENGO** es una aplicación móvil de **mercado inverso** para Colombia. En lugar de que los vendedores publiquen sus productos, son los **compradores** quienes publican lo que necesitan y los **vendedores** quienes compiten ofertando precio y tiempo de entrega.

> "¿Qué necesitas? Publícalo — y deja que los vendedores vengan a ti."

---

## Tabla de contenidos

1. [Concepto](#concepto)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Iniciar el proyecto](#iniciar-el-proyecto)
5. [Credenciales de demo](#credenciales-de-demo)
6. [Flujo completo del proceso](#flujo-completo-del-proceso)
   - [Inicio de sesión / Registro](#1-inicio-de-sesión--registro)
   - [Crear una solicitud (Comprador)](#2-crear-una-solicitud-comprador)
   - [Descubrir solicitudes (Vendedor)](#3-descubrir-solicitudes-vendedor)
   - [Enviar una oferta (Vendedor)](#4-enviar-una-oferta-vendedor)
   - [Revisar y aceptar oferta (Comprador)](#5-revisar-y-aceptar-oferta-comprador)
   - [Negociación y chat](#6-negociación-y-chat)
   - [Cierre y calificación](#7-cierre-y-calificación)
7. [Estados de una solicitud](#estados-de-una-solicitud)
8. [Estados de una oferta](#estados-de-una-oferta)
9. [Roles de usuario](#roles-de-usuario)
10. [Consideraciones técnicas](#consideraciones-técnicas)

---

## Concepto

LO TENGO invierte el modelo tradicional de e-commerce:

| Modelo tradicional | LO TENGO (Mercado inverso) |
|--------------------|---------------------------|
| Vendedor publica producto | **Comprador publica necesidad** |
| Comprador busca entre catálogos | **Vendedores compiten ofertando** |
| Precio fijo | **Precio y tiempo de entrega negociables** |
| Comprador elige tienda | **Vendedores se acercan al comprador** |

El comprador describe exactamente lo que necesita (producto, cantidad, ubicación de entrega) y recibe múltiples ofertas de vendedores cercanos, ordenables por precio o tiempo de entrega. Una vez aceptada la mejor oferta, ambas partes se comunican por chat interno hasta cerrar la transacción.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Expo SDK 54 + React Native 0.81 |
| Lenguaje | TypeScript |
| Estilos | NativeWind v4 (Tailwind CSS para RN) |
| Estado global | Zustand v5 |
| Formularios | react-hook-form + zod |
| Navegación | React Navigation v7 (Stack + Bottom Tabs) |
| Persistencia local | AsyncStorage (mock DB en desarrollo) |
| Backend / Auth | Firebase (Firestore + Storage + Auth) |
| Mapas | react-native-maps (Google Maps en Android) |
| Animaciones | react-native-reanimated v4 |

---

## Estructura del proyecto

```
LoTengoApp01/
├── src/
│   ├── screens/
│   │   ├── auth/          # Login, Register, ForgotPassword, OtpVerify
│   │   ├── buyer/         # BuyerHome, CreateRequest, MyRequests, RequestDetail
│   │   ├── seller/        # SellerMap, SellerAlerts, MyOffers, SendOffer, SellerRequestDetail, Catalog, AddProduct
│   │   ├── shared/        # Chat, ChatsList, Profile
│   │   └── IntroScreen.tsx
│   ├── components/
│   │   ├── cards/         # RequestCard, OfferCard
│   │   ├── map/           # MapPicker
│   │   └── ui/            # TextField, SelectField, PrimaryButton, AppHeader, etc.
│   ├── navigation/        # AppNavigator, AuthStack, BuyerTabs, SellerTabs
│   ├── services/          # authService, requestService, offerService, chatService, ratingService, storageService
│   ├── store/             # authStore (Zustand)
│   ├── db/                # mockDb.ts, seedDb.ts
│   ├── types/             # index.ts (modelos), navigation.ts (tipos de pantallas)
│   ├── theme/             # colors, tokens, ThemeProvider
│   └── utils/             # helpers (formatCOP, formatDate, CATEGORIES, DEPARTMENTS…)
├── assets/                # Imágenes, fuentes, logo
├── App.tsx
├── app.json
├── tailwind.config.js
├── babel.config.js
└── metro.config.js
```

---

## Iniciar el proyecto

### Requisitos previos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli` o usar `npx expo`)
- Android Studio / Xcode (para emuladores) o app Expo Go en el dispositivo

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd LoTengoApp01

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npx expo start
```

### Ejecutar en dispositivo/emulador

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios

# Web (limitado)
npx expo start --web
```

> **Nota:** El proyecto usa la **New Architecture** de React Native. Asegúrate de tener el emulador correctamente configurado con soporte para Hermes.

---

## Credenciales de demo

El proyecto incluye datos semilla (`src/db/seedDb.ts`) con usuarios preconfigurados para pruebas:

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Comprador | `alex@demo.com` | `demo1234` |
| Vendedor | `maria@demo.com` | `demo1234` |
| Vendedor | `carlos@demo.com` | `demo1234` |
| Vendedor | `laura@demo.com` | `demo1234` |

> Los datos de demo se persisten en AsyncStorage. Para reiniciar el estado a los datos originales de seed, puedes llamar `resetDb()` desde `src/db/mockDb.ts`.

---

## Flujo completo del proceso

### 1. Inicio de sesión / Registro

**Pantallas:** `LoginScreen` | `RegisterScreen` | `ForgotPasswordScreen` | `OtpVerifyScreen`

#### Iniciar sesión
1. Abrir la app — se muestra la pantalla **IntroScreen** (splash animado con logo).
2. Presionar **Ingresar** o esperar la transición automática.
3. En `LoginScreen` ingresar correo y contraseña.
4. Al autenticarse, el sistema detecta el rol del usuario (`buyer` o `seller`) y redirige automáticamente al stack correspondiente.

**Consideraciones:**
- La validación usa Zod: el correo debe ser válido y la contraseña no puede estar vacía.
- Si las credenciales no coinciden, se muestra alerta "Correo o contraseña incorrectos".
- El botón **¿Olvidaste tu contraseña?** inicia el flujo OTP (código de 6 dígitos enviado al correo).
- El botón **Google** habilita login con Google (SSO).

#### Crear cuenta
1. Desde `LoginScreen` presionar **Crear una cuenta**.
2. En `RegisterScreen` seleccionar el rol con el control segmentado: **Soy Comprador** o **Soy Oferente**.
3. Completar los campos requeridos:
   - **Comprador:** nombre completo, celular, departamento, ciudad, dirección, correo, contraseña.
   - **Vendedor (Oferente):** además incluye **Nombre o Razón Social** (nombre del negocio).
4. La contraseña debe tener mínimo 8 caracteres y coincidir con la confirmación.
5. Al registrarse exitosamente, el usuario queda logueado automáticamente.

**Consideraciones:**
- El campo **Departamento** usa `SelectField` (selector de lista modal), no texto libre.
- El prefijo telefónico `+57` está fijo (Colombia).
- El correo electrónico debe ser único en el sistema.

---

### 2. Crear una solicitud (Comprador)

**Pantallas:** `BuyerHomeScreen` → `CreateRequestScreen`

#### Desde la pantalla principal del comprador
- La pantalla principal (`BuyerHomeScreen`) muestra las solicitudes activas del comprador con contador de ofertas recibidas.
- Las tarjetas de categorías (Electrónica, Comida, Servicios, Hogar, Moda, Otro) navegan directamente a `CreateRequestScreen` con la categoría preseleccionada.
- El botón flotante **+** también abre `CreateRequestScreen`.

#### Formulario de nueva solicitud

El formulario está dividido en 4 secciones:

**1. Información básica** (requerida)
- **Título:** descripción breve de lo que se necesita (mínimo 3 caracteres). Ej: *"Sillón de cuero vintage"*.
- **Descripción:** detalle específico — marca, color, talla, condición, etc.
- **Cantidad** y **Unidad:** opcionales. Ej: `12 unidades`.

**2. Categoría** (opcional)
- Chips seleccionables: `Electrónica`, `Comida`, `Servicios`, `Hogar`, `Moda`, `Otro`.
- Ayuda a los vendedores a filtrar solicitudes relevantes.

**3. Ubicación de entrega** (requerida)
- Se muestra la **dirección registrada** del comprador como opción rápida.
- Se muestran **direcciones frecuentes** (guardadas de solicitudes anteriores) como chips horizontales.
- Botón **Agregar nueva dirección** abre un modal con campos de Departamento, Ciudad y Dirección; el pin del mapa se posiciona en esa ubicación.
- **Mapa interactivo:** el comprador puede tocar el mapa para ajustar exactamente el punto de entrega. El pin rojo indica la posición seleccionada.
- Si no se selecciona ubicación, se bloquea el envío con alerta.

**4. Notas adicionales** (opcional)
- Instrucciones especiales: *"Entrega en portería, llamar al llegar, horario preferido..."*

#### Publicación
- Al presionar **Publicar Solicitud**, se muestra el componente `PublishRequestLoader` con 3 pasos animados:
  1. Preparando solicitud...
  2. Publicando en red de vendedores...
  3. Notificando vendedores cercanos...
- Si la ubicación es diferente a la registrada, se guarda automáticamente como dirección frecuente para futuras solicitudes.
- Al completarse, la solicitud queda en estado **OPEN** y es visible para todos los vendedores.

**Consideraciones:**
- Una solicitud sin ubicación no puede publicarse.
- El título es el único campo de texto obligatorio.
- La categoría es opcional pero mejora la visibilidad ante vendedores especializados.

---

### 3. Descubrir solicitudes (Vendedor)

**Pantallas:** `SellerMapScreen` | `SellerAlertsScreen`

#### Mapa de solicitudes
- La pantalla **Mapa** (`SellerMapScreen`) muestra en tiempo real todos las solicitudes con estado **OPEN** como pines rojos sobre el mapa.
- El mapa centra en la ubicación del vendedor (o en Medellín por defecto).
- Al tocar un pin se despliega un callout con el título y fecha de la solicitud.
- Al tocar el callout se navega al **detalle de la solicitud** (`SellerRequestDetailScreen`).

#### Alertas
- La pestaña **Alertas** (`SellerAlertsScreen`) muestra un listado de notificaciones: nuevas solicitudes en la zona, estados de ofertas enviadas, mensajes recibidos, etc.

---

### 4. Enviar una oferta (Vendedor)

**Pantallas:** `SellerRequestDetailScreen` → `SendOfferScreen`

#### Ver detalle de la solicitud
- `SellerRequestDetailScreen` muestra:
  - Título, descripción, cantidad, notas y fecha de la solicitud.
  - Nombre del comprador.
  - Estado actual (`OPEN`, `NEGOTIATING`, etc.).
  - Si el vendedor ya envió oferta: card con el estado de su oferta (Enviada / Aceptada / Rechazada).
  - Si su oferta fue aceptada: botón **Ir al Chat**.

#### Formulario de oferta (`SendOfferScreen`)
Solo disponible cuando la solicitud está en estado **OPEN** y el vendedor no ha ofertado aún.

Campos del formulario:
- **Precio (COP):** valor numérico mayor a 0. Se muestra con el prefijo `$`.
- **Tiempo de entrega:** valor numérico + unidad seleccionable (`Min` / `Horas` / `Días`).
- **Notas (opcional):** condiciones especiales. Ej: *"Incluye hielo sin costo"*.
- **Fotos del producto (opcional):** hasta 3 imágenes desde la galería. Se suben a Firebase Storage y se adjuntan a la oferta.

Al presionar **Enviar Oferta**:
- Las imágenes se suben a Firebase Storage.
- La oferta se crea con estado **SUBMITTED**.
- El comprador recibe una notificación de nueva oferta.
- El vendedor regresa a la pantalla anterior.

**Consideraciones:**
- Un vendedor solo puede enviar **una oferta por solicitud**.
- El botón "Participar - Enviar Oferta" desaparece una vez enviada la oferta.
- No se puede ofertar en solicitudes en estado diferente a **OPEN**.

---

### 5. Revisar y aceptar oferta (Comprador)

**Pantallas:** `RequestDetailScreen`

#### Ver las ofertas recibidas
Desde `BuyerHomeScreen` → tocar una solicitud activa → `RequestDetailScreen`.

La pantalla muestra:
- Información de la solicitud (título, descripción, estado, fecha).
- **Lista de ofertas recibidas** cuando el estado es **OPEN** o **NEGOTIATING**.
- Selector de ordenación: **Precio** (menor a mayor) | **Tiempo** (menor a mayor).
- Cada oferta muestra: vendedor, precio en COP, tiempo de entrega, notas y miniaturas de fotos adjuntas.

#### Aceptar una oferta
1. Con la solicitud en estado **OPEN**, presionar el botón **Aceptar** en la `OfferCard` deseada.
2. Se muestra una alerta de confirmación: *"¿Estás seguro?"*.
3. Al confirmar:
   - La oferta seleccionada cambia a estado **ACCEPTED**.
   - Las demás ofertas cambian a **REJECTED**.
   - La solicitud cambia a estado **NEGOTIATING**.
   - Se crea automáticamente un **chat** entre el comprador y el vendedor ganador.
   - Ambas partes reciben notificación.

**Consideraciones:**
- Solo se puede aceptar una oferta cuando la solicitud está en **OPEN**.
- En estado **NEGOTIATING** las ofertas son visibles en modo solo lectura (sin botón de aceptar).
- Una vez aceptada una oferta **no se puede cambiar** — el flujo avanza hacia negociación/cierre.

---

### 6. Negociación y chat

**Pantallas:** `ChatScreen` | `ChatsListScreen`

Tras aceptar una oferta, la solicitud entra en fase **NEGOTIATING** y se habilita el canal de chat directo:

- Tanto comprador como vendedor ven el botón **Ir al Chat** en el detalle de la solicitud/oferta.
- El chat soporta mensajes de texto, imágenes y archivos adjuntos.
- En `ChatsListScreen` se muestran todas las conversaciones activas.
- El vendedor puede acceder a sus chats activos desde la pestaña **Mis Ofertas** (badge con contador).

**Consideraciones:**
- El chat solo existe si hay una oferta aceptada — no antes.
- Los mensajes persisten en la base de datos local/Firestore.

---

### 7. Cierre y calificación

**Pantalla:** `RequestDetailScreen` (comprador) | `SellerRequestDetailScreen` (vendedor)

#### Flujo de cierre (desde el comprador)

Con la solicitud en **NEGOTIATING**:
1. Presionar **Marcar venta como cerrada** → estado cambia a **CLOSED**.
2. Presionar **Marcar producto aceptado** → estado cambia a **ACCEPTED**.

> El paso "cerrada" (`CLOSED`) es un estado intermedio que confirma que la entrega ocurrió. El paso "aceptado" (`ACCEPTED`) confirma la conformidad total del comprador.

#### Calificación mutua
Una vez en estado **ACCEPTED**, ambas partes pueden calificarse:

- **Comprador califica al vendedor** desde `RequestDetailScreen`:
  - Estrellas del 1 al 5 (interactivas).
  - Comentario opcional.
  - Botón **Enviar calificación**.

- **Vendedor califica al comprador** desde `SellerRequestDetailScreen` (solo si su oferta fue aceptada):
  - Mismo componente de estrellas y comentario.

**Consideraciones:**
- Cada usuario solo puede calificar **una vez** por transacción.
- Una vez enviada la calificación, el widget cambia a un mensaje de confirmación con ícono de check verde.
- Las calificaciones actualizan el `ratingAvg` y `ratingCount` del perfil del usuario calificado.
- La calificación solo está disponible en estado **ACCEPTED** — no en **CLOSED** ni **NEGOTIATING**.

---

## Estados de una solicitud

```
OPEN ──────► NEGOTIATING ──────► CLOSED ──────► ACCEPTED
  │                                               (calificación disponible)
  └──► CANCELLED
```

| Estado | Descripción |
|--------|-------------|
| `OPEN` | Solicitud publicada, recibiendo ofertas. Compradores pueden aceptar. |
| `NEGOTIATING` | Oferta aceptada. Chat activo. Otras ofertas rechazadas. |
| `CLOSED` | Comprador confirmó que la entrega ocurrió. |
| `ACCEPTED` | Comprador aceptó el producto. Calificación disponible. |
| `CANCELLED` | Solicitud cancelada por el comprador. |

---

## Estados de una oferta

| Estado | Descripción |
|--------|-------------|
| `SUBMITTED` | Oferta enviada, en espera de revisión del comprador. |
| `ACCEPTED` | Oferta aceptada por el comprador. Se crea el chat. |
| `REJECTED` | Oferta rechazada (el comprador aceptó otra). |
| `WITHDRAWN` | Retirada por el vendedor. |

---

## Roles de usuario

### Comprador (`buyer`)

| Acción | Pantalla |
|--------|---------|
| Ver solicitudes activas y contador de ofertas | `BuyerHomeScreen` |
| Crear nueva solicitud | `CreateRequestScreen` |
| Ver historial de solicitudes | `MyRequestsScreen` |
| Ver detalle y ofertas de una solicitud | `RequestDetailScreen` |
| Aceptar una oferta | `RequestDetailScreen` |
| Chatear con el vendedor | `ChatScreen` |
| Cerrar / aceptar la transacción | `RequestDetailScreen` |
| Calificar al vendedor | `RequestDetailScreen` |

### Vendedor / Oferente (`seller`)

| Acción | Pantalla |
|--------|---------|
| Ver solicitudes abiertas en el mapa | `SellerMapScreen` |
| Ver notificaciones | `SellerAlertsScreen` |
| Ver y gestionar mis ofertas | `MyOffersScreen` |
| Ver detalle de una solicitud | `SellerRequestDetailScreen` |
| Enviar oferta | `SendOfferScreen` |
| Gestionar catálogo de productos | `CatalogScreen` / `AddProductScreen` |
| Chatear con el comprador | `ChatScreen` |
| Calificar al comprador | `SellerRequestDetailScreen` |

---

## Consideraciones técnicas

### Base de datos
- En desarrollo se usa una **base de datos en memoria** (`src/db/mockDb.ts`) con persistencia en AsyncStorage (`@lotengo_db`).
- Los datos iniciales se cargan desde `src/db/seedDb.ts`.
- La función `resetDb()` restaura el estado original de seed.
- En producción el backend apunta a **Firebase Firestore**.

### Autenticación
- La autenticación local compara email + password en la DB en memoria.
- Firebase Auth está integrado para Google Sign-In y flujos de producción.
- El estado del usuario autenticado se gestiona con **Zustand** (`authStore`).

### Imágenes
- Las fotos adjuntas en ofertas se suben a **Firebase Storage** mediante `storageService.ts`.
- El selector de imágenes usa `expo-image-picker` con límite de 3 imágenes por oferta.

### Mapas
- Se usa `react-native-maps` con `PROVIDER_GOOGLE` en Android.
- El mapa centra por defecto en **Medellín, Colombia** (`lat: 6.2442, lng: -75.5812`).
- La ubicación del usuario se obtiene con `expo-location`.

### Tema de marca
- Paleta principal: `ember #ad3020` (primario / comprador), `ocean #33559a` (secundario), `orange #ef741c` (acento / vendedor), `lime #94cc1c` (acento secundario).
- Sistema de tema en `src/theme/` con soporte para modos claro/oscuro/sistema.
- Todas las clases de estilo son NativeWind v4 (Tailwind CSS).
