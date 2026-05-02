# Ecommerce MVP - Demo QA Checklist

Fecha: 2026-05-01
Estado: listo para QA final local

## Credenciales Demo

- Admin: `admin-ecommers@local.test`
- Password: `AdminEcommers123!`

## Arranque Local

Backend:

```bash
cd backend-ecommerce
npm run dev
```

Frontend:

```bash
cd frontend-ecommerce
npm run dev
```

URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8800`
- Health: `http://localhost:8800/healthz`
- Ready: `http://localhost:8800/readyz`

## Flujo De Demo

1. Abrir home `/`.
2. Revisar hero, mini-tiendas y catálogo.
3. Abrir un producto desde catálogo.
4. Enviar intención por WhatsApp con nombre y teléfono.
5. Entrar a `/dashboard/login`.
6. Revisar lead en `/dashboard/leads`.
7. Ir a `/dashboard/products`.
8. Filtrar por tienda y registrar movimiento de inventario.
9. Ir a `/dashboard/inventory`.
10. Revisar stock actual, métricas, movimientos y exportar CSV.

## QA Funcional

- Home carga productos activos.
- Secciones públicas muestran productos por tienda.
- Botón WhatsApp abre `wa.me` con mensaje prellenado.
- Login admin funciona.
- Productos se crean/editan con `storeId`.
- Filtro de tienda en Productos funciona.
- Tiendas se crean/editan desde dashboard.
- Leads muestran tienda/producto cuando existe.
- Movimiento de inventario actualiza `products.stock`.
- No permite movimiento que deje stock negativo.
- Inventario muestra productos existentes aunque no haya ventas.
- Export CSV descarga archivo con movimientos.

## QA Visual

- Revisar mobile: 320px, 375px, 414px.
- Revisar desktop: 1366px y 1440px.
- No debe haber texto cortado en botones principales.
- Tarjetas de producto deben mostrar CTA visible en móvil.
- Dashboard debe mantener tabla legible con scroll horizontal.
- Home debe sentirse como tienda real, no landing vacía.

## Variables Requeridas Para Producción

Frontend:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_WA_PHONE`
- `NEXT_PUBLIC_CURRENCY`

Backend:

- `NODE_ENV=production`
- `DATABASE_URL` o `DB_*`
- `JWT_SECRET` fuerte
- `CORS_ORIGIN`
- `PUBLIC_APP_URL`
- `WHATSAPP_BUSINESS_PHONE`
- Supabase/S3 si se requiere storage persistente

## Comandos De Validación

Frontend:

```bash
npm run typecheck
npm run build
```

Backend:

```bash
npm run typecheck
npm run build
```

## Pendientes Reales Antes De Producción

- Configurar dominio real del frontend y backend.
- Cambiar `JWT_SECRET`.
- Configurar número real de WhatsApp.
- Definir storage persistente para imágenes.
- Confirmar política de backups de PostgreSQL.
- Confirmar datos legales/comerciales del cliente: dirección, horarios, cambios.
- Reemplazar credenciales demo por usuarios reales.
