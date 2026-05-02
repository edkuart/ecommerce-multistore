# backend-ecommerce

Clean single-vendor ecommerce backend extracted from Flowjuyu patterns.

## Architecture

This backend is a modular monolith. HTTP routes are registered from
`src/modules`, while shared infrastructure stays in `src/shared`.

Current modules:

- `health`: service health endpoint.
- `auth`: admin/seller authentication.
- `categories`: product category catalog.
- `products`: public catalog and protected product management.
- `stores`: internal mini-store management for multi-store light.
- `inventory`: stock ledger, metrics and CSV export.
- `whatsapp`: lead capture and WhatsApp URL generation.
- `leads`: admin lead review.
- `orders`: simple order capture kept for current frontend compatibility.

## What is included

- Express + TypeScript server
- Sequelize + PostgreSQL connection
- JWT authentication
- User model with `admin` and `seller` roles
- Category model for catalog organization
- Product model without marketplace/vendor relationships
- Product slug, SKU, featured/active flags, stock status, GTQ currency default
- Lead, purchase intent and WhatsApp click tracking models
- Product CRUD endpoints
- Store CRUD endpoints
- Inventory movement ledger with stock cache updates
- Inventory metrics and CSV export endpoints
- Supabase Storage upload support with local upload fallback

## Endpoints

- `GET /healthz`
- `GET /readyz`
- `POST /auth/register`
- `POST /auth/login`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /stores`
- `POST /stores`
- `PUT /stores/:id`
- `GET /inventory/movements`
- `POST /inventory/movements`
- `GET /inventory/metrics`
- `GET /inventory/metrics/sales-by-day`
- `GET /inventory/metrics/top-products`
- `GET /inventory/export`
- `POST /whatsapp/intents`
- `GET /leads`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`

Protected product mutations require:

```http
Authorization: Bearer <token>
```

Protected category mutations use the same header.
Protected lead/order reads use the same header.
Protected store and inventory operations use the same header.

## Catalog notes

`GET /products/:id` accepts either a UUID or a product slug. New products
receive a unique slug automatically from their name unless a `slug` is provided.

Useful product query params:

- `category`: matches the legacy category text or the category slug.
- `storeId`: filters products by internal store.
- `categoryId`: filters by category UUID.
- `featured=true`: returns featured products.
- `active=true`: returns active products.

## Inventory Notes

Inventory uses an append-only ledger in `inventory_movements`. Product `stock`
is maintained as a read cache and updated in the same transaction when a
movement is created.

Movement types:

- `CREATION`
- `RESTOCK`
- `SALE`
- `ADJUSTMENT`
- `RETURN`
- `DAMAGE`

On startup in development, existing products with stock and no movement history
receive one idempotent `CREATION` movement so the demo inventory dashboard is
not empty.

The API keeps legacy fields such as `category` and `images` for frontend
compatibility while the database now has a cleaner path toward formal
categories and richer catalog metadata.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Seed a vendible demo catalog:

```bash
npm run seed:demo
```

Default local ports:

- API: `http://localhost:8800`
- Frontend CORS origin: `http://localhost:3000`

## Production Notes

- Set `NODE_ENV=production`.
- Use a strong `JWT_SECRET`.
- Set `CORS_ORIGIN` to the exact frontend URL.
- Set `WHATSAPP_BUSINESS_PHONE` to the real business number.
- Use `GET /readyz` for deployment readiness checks.
- Prefer Supabase/S3 or persistent disk for product images in production.
- Keep `SUPABASE_SERVICE_ROLE_KEY` only in backend environment variables.
