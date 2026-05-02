# Frontend Ecommerce — Documentación del proyecto

## Descripción

Frontend de un ecommerce multi-store guatemalteco construido con Next.js 14 App Router y Tailwind CSS. Permite catálogo público, cotización por WhatsApp y admin multi-tienda.

**Flujo principal:** Cliente ve producto → selecciona variante/cantidad → completa formulario → el sistema guarda lead → abre WhatsApp con mensaje prellenado al número de la tienda.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS con tokens personalizados
- **Tipografías:** DM Serif Display · JetBrains Mono · Inter (Google Fonts vía `next/font`)
- **Backend:** NestJS en `NEXT_PUBLIC_API_URL` (default `localhost:8800`)

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL del backend NestJS |
| `NEXT_PUBLIC_APP_URL` | URL pública del frontend |
| `NEXT_PUBLIC_WA_PHONE` | Número WhatsApp de fallback |
| `NEXT_PUBLIC_CURRENCY` | Código ISO moneda (GTQ) |
| `SELLER_API_TOKEN` | Token server-side (opcional) |

## Comandos

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run typecheck # Verificación de tipos sin build
```

## Arquitectura multi-store

Una sola DB, productos con `store_id`. El admin trabaja con store seleccionada via `?storeId=` en URL. El frontend público muestra catálogo unificado por categorías/tipo de tienda.

```
stores (girls_clothing | general_clothing | shoes | wholesale | other)
  └── products (storeId FK)
       └── leads (storeId FK, productId FK)
            └── purchase_intents (leadId FK, whatsappUrl, status)
```

## Estructura de carpetas clave

```
src/
  app/
    page.tsx                    # Home pública (Hero + Trust + Categories + Stores + CTA)
    product/[id]/page.tsx       # Detalle de producto
    dashboard/                  # Admin protegido por middleware
      page.tsx                  # Resumen con stats por store
      products/page.tsx         # CRUD productos filtrado por store
      stores/page.tsx           # CRUD tiendas
      leads/page.tsx            # Leads filtrados por store
      categories/page.tsx       # CRUD categorías
      login/page.tsx            # Auth (establece cookie seller_token)
    api/dashboard/              # Proxies server-side al backend
  components/
    home/
      HeroSection.tsx           # Hero asimétrico con collage
      TrustStrip.tsx            # Strip oscuro "conversando"
      CategoriesIndex.tsx       # Índice tipográfico de tiendas
      StoreProductSections.tsx  # 4 secciones editoriales por tipo
      CTABand.tsx               # Banda clay con CTA WhatsApp
    product/
      ProductCard.tsx           # Card con overlay de quick-actions
      AddToCartPanel.tsx        # Panel de cotización en detalle de producto
    dashboard/
      DashboardShell.tsx        # Layout con nav activa + logout
      ProductManager.tsx        # CRUD productos (recibe selectedStoreId)
      StoreManager.tsx          # CRUD tiendas
      LeadManager.tsx           # Vista de leads con badges de estado
      StoreFilter.tsx           # Selector de tienda por URL param
    layout/
      Header.tsx                # Sticky, brand serif, nav a secciones
      Footer.tsx                # Ink, 4 columnas, datos de negocio
      FloatingWhatsApp.tsx      # Botón flotante
    cart/
      CartProvider.tsx          # Contexto de carrito (client)
  lib/
    api.ts                      # Fetchers públicos (productos, stores, categorías)
    dashboardApi.ts             # Fetchers del dashboard (leads)
    dashboardProxy.ts           # Auth headers + cookie para proxies
    whatsapp.ts                 # buildWhatsAppUrl + createWhatsAppIntent
  types/
    product.ts store.ts lead.ts category.ts order.ts cart.ts
  config/
    env.ts                      # Variables de entorno con defaults
  middleware.ts                 # Protección de /dashboard/* → redirect a login
```

## Autenticación del dashboard

- Login en `/dashboard/login` → POST a `/api/dashboard/auth/login` → backend retorna JWT → se guarda como cookie httpOnly `seller_token`
- El middleware (`src/middleware.ts`) verifica la cookie en cada ruta `/dashboard/*`
- Sin cookie → redirect a `/dashboard/login?from=<ruta>`
- Logout → POST a `/api/dashboard/auth/logout` → cookie se elimina → redirect a login

## Design tokens (Tailwind)

```
Colores:  ink | paper | paper-deep | linen | moss | clay | clay-soft | whats | indigo
Fuentes:  font-serif (DM Serif Display) | font-mono (JetBrains Mono) | font-sans (Inter)
Sombras:  shadow-flat | shadow-soft | shadow-hover
Easing:   ease-commerce = cubic-bezier(.2,.7,.2,1)
```

## Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#171511` | Texto principal, fondos oscuros |
| `paper` | `#fbfaf7` | Fondo general |
| `paper-deep` | `#f5f1e8` | Fondo alternado en secciones |
| `linen` | `#f1ece3` | Fondos de cards, placeholders |
| `moss` | `#273f32` | Acento primario (CTAs, precios) |
| `clay` | `#9c5f3f` | Acento secundario (eyebrows, énfasis) |
| `clay-soft` | `#c98565` | Clay sobre fondos oscuros |
| `whats` | `#128c7e` | Botones WhatsApp |
| `indigo` | `#2f405f` | Acento frío |

## Fases del proyecto

| Fase | Estado |
|---|---|
| 1 — Modelo Multi-Store Base | ✅ Completa |
| 2 — Contexto de Store en Admin | ✅ Completa |
| 3 — Home Unificada Impactante | ✅ Completa |
| 4 — WhatsApp por Store | ✅ Completa |
| 5 — Admin Más Vendible | ✅ Completa |
| 6 — Pulido Visual Demo | ⚠️ 80% |
| 7 — Preparación para Escalar | ✅ Completa |

## Pendiente para producción (Fase 6)

- [ ] Imágenes reales de productos (reemplazar placeholders SVG)
- [ ] Número de WhatsApp real en `.env.local`
- [ ] URL del backend de producción en `NEXT_PUBLIC_API_URL`
- [ ] URL del frontend en `NEXT_PUBLIC_APP_URL`
- [ ] Verificar mobile en dispositivos reales
- [ ] Datos de contacto reales en `Footer.tsx` (dirección, horario)
- [ ] Nombre comercial real (buscar "Ecommerce" en `Header.tsx`, `Footer.tsx`, `layout.tsx`)
