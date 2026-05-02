# Ecommerce MVP Launch Checklist

## Required Production Variables

Frontend:

- `NEXT_PUBLIC_API_URL`: public backend URL.
- `NEXT_PUBLIC_APP_URL`: public storefront URL.
- `NEXT_PUBLIC_WA_PHONE`: WhatsApp number in international format without `+`.
- `NEXT_PUBLIC_CURRENCY`: `GTQ` unless the business changes currency.

Backend:

- `NODE_ENV=production`
- `PORT`
- `DATABASE_URL`
- `DB_SSL=true` when using managed PostgreSQL with SSL.
- `DB_SCHEMA=ecommerce`
- `JWT_SECRET`: long random value, never the development default.
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGIN`: exact frontend URL.
- `PUBLIC_APP_URL`: exact frontend URL.
- `WHATSAPP_BUSINESS_PHONE`: business WhatsApp number.

Optional storage:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

If Supabase storage values are missing, product images are stored locally in
`backend-ecommerce/uploads/product-images`. For production, prefer Supabase/S3
or persistent disk.

## Pre-Launch Checks

- Run frontend `npm run typecheck`.
- Run frontend `npm run build`.
- Run backend `npm run typecheck`.
- Run backend `npm run build`.
- Verify `GET /healthz` returns `200`.
- Verify `GET /readyz` returns `200`.
- Create one admin/seller account.
- Log into `/dashboard/login`.
- Create one category.
- Create one product with image.
- Open product detail.
- Submit WhatsApp lead form.
- Confirm the lead appears in `/dashboard/leads`.
- Replace test WhatsApp number `50200000000`.
- Remove or archive test leads/products before client handoff.

## Deployment Notes

- Deploy frontend and backend as separate services.
- Keep `SELLER_API_TOKEN` empty in frontend production unless using server-side
  fallback automation. Dashboard login should use the HTTP-only cookie flow.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in frontend variables.
- Enable database backups in the PostgreSQL provider.
- Confirm uploaded images are persisted after backend restart.
- Restrict `CORS_ORIGIN` to the real frontend domain.

## Current MVP Scope

Included:

- Product catalog.
- Product detail.
- Categories.
- Admin product/category management.
- WhatsApp lead capture.
- Lead dashboard.

Intentionally not included yet:

- Payment checkout.
- Automated WhatsApp Cloud API messages.
- Multi-vendor marketplace behavior.
- Complex inventory reservations.
- AI/chatbot flows.
