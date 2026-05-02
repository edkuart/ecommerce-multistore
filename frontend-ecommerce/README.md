# frontend-ecommerce

Next.js storefront for a multi-store light ecommerce MVP focused on WhatsApp conversion.

## Included

- Public product catalog.
- Product detail pages with slug support.
- Category filters.
- WhatsApp lead capture before opening chat.
- Lightweight cart/intention flow.
- Unified public store with internal mini-store sections.
- Admin dashboard for stores, products, categories, leads, orders and inventory.
- Inventory ledger UI with stock alerts, metrics and CSV export proxy.
- Dashboard login through HTTP-only cookie.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Default local URL:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8800`

## Main Routes

- `/`: catalog.
- `/product/:idOrSlug`: product detail.
- `/dashboard/login`: admin login.
- `/dashboard/stores`: internal mini-store management.
- `/dashboard/products`: product management.
- `/dashboard/inventory`: stock dashboard, movements, metrics and export.
- `/dashboard/categories`: category management.
- `/dashboard/leads`: WhatsApp leads.
- `/dashboard/orders`: existing order view.

## Environment

Required:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_WA_PHONE`
- `NEXT_PUBLIC_CURRENCY`

Optional:

- `SELLER_API_TOKEN`: server-side dashboard proxy fallback. Prefer dashboard
  login for normal usage.

## Validation

```bash
npm run typecheck
npm run build
```

## Demo Assets

The demo catalog can use SVG product images stored in `public/demo`.
Backend demo products reference these images through `NEXT_PUBLIC_APP_URL` /
`PUBLIC_APP_URL`.

## Demo Flow

1. Open `/` and review the unified catalog.
2. Open a product detail and submit the WhatsApp contact form.
3. Login at `/dashboard/login`.
4. Review the lead in `/dashboard/leads`.
5. Register a stock movement from `/dashboard/products`.
6. Review metrics and export CSV from `/dashboard/inventory`.
