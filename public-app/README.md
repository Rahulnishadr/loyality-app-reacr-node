# Shopify Public App — Loyalty & Notes

Multi-tenant Shopify Public App with Node.js (Express, Sequelize, PostgreSQL) backend and React (Vite, Polaris, App Bridge) embedded frontend.

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, Sequelize (REST API)
- **Frontend:** React (Vite), @shopify/polaris, @shopify/app-bridge-react
- **Auth:** Shopify OAuth 2.0, session token validation for embedded app
- **Features:** Customer notes & loyalty points (CRUD), billing test plan, webhooks (app/uninstalled + GDPR)

## Folder Structure

```
/public-app
├── client/                 # React embedded app (Vite)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                 # Express + Sequelize
│   └── src/
│       ├── config/
│       ├── db/
│       │   └── migrations/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── index.js
├── shopify.app.toml
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL
- [Shopify Partner account](https://partners.shopify.com) and a **Public** app (not custom app)
- ngrok (for local development so Shopify can reach your server)

## Setup

### 1. Clone and install

```bash
cd public-app
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Environment variables

Copy `.env.example` to `.env` and set:

```bash
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL` — PostgreSQL connection string, e.g. `postgres://user:password@localhost:5432/shopify_app_db`
- `SHOPIFY_API_KEY` — From Partner Dashboard → Your app → Client credentials
- `SHOPIFY_API_SECRET` — Same place (API secret key)
- `SCOPES` — e.g. `read_products,write_products,read_customers,write_customers,read_orders`
- `FRONTEND_URL` — URL where the React app is served (see “Run locally with ngrok”)
- `APP_URL` — URL of the Express server (same as backend in dev with ngrok)
- **Email (optional):** To send a welcome email to the store admin when the app is installed, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.

For the **client**, create `client/.env`:

```bash
VITE_SHOPIFY_API_KEY=your_api_key_same_as_backend
```

### 3. Database

Create the database, then start the server. Tables sync automatically on startup:

```bash
createdb shopify_app_db
# Then run: npm run dev (server will sync DB on start)
```

### 4. Run locally with ngrok

The app must be reachable by Shopify (OAuth redirects and webhooks). Use ngrok for both backend and frontend in development.

1. **Start backend and frontend**

   ```bash
   npm run dev
   ```

   This runs:
   - Server: `http://localhost:3000`
   - Client: `http://localhost:5173`

2. **Expose with ngrok (two tunnels)**

   Terminal 1 (backend):

   ```bash
   ngrok http 3000
   ```

   Terminal 2 (frontend, for embedded app URL):

   ```bash
   ngrok http 5173
   ```

   Note the HTTPS URLs, e.g.:
   - Backend: `https://abc123.ngrok.io`
   - Frontend: `https://def456.ngrok.io`

3. **Configure `.env`**

   - `APP_URL=https://abc123.ngrok.io`
   - `FRONTEND_URL=https://def456.ngrok.io`

   Restart the server after changing `.env`.

4. **Configure the app in Partner Dashboard**

   - **App URL** (where the embedded app loads): `https://def456.ngrok.io` (your frontend ngrok URL). Must use `https`.
   - **Allowed redirection URL(s):** add `https://abc123.ngrok.io/auth/callback`
   - **Webhooks:** register:
     - `https://abc123.ngrok.io/webhooks/app/uninstalled`
     - `https://abc123.ngrok.io/webhooks/customers/data_request`
     - `https://abc123.ngrok.io/webhooks/customers/redact`
     - `https://abc123.ngrok.io/webhooks/shop/redact`
   - Use **HTTPS** for all URLs.

5. **Install the app on a development store**

   Open in browser (replace `your-dev-store` with your store’s myshopify domain):

   ```
   https://abc123.ngrok.io/auth?shop=your-dev-store.myshopify.com
   ```

   Complete OAuth; you’ll be redirected to the embedded app (frontend URL with `?shop=...&host=...`). Shop details are saved in the DB and an email is sent to the store admin if SMTP is configured. The app opens inside the Shopify Admin iframe.

### 5. Optional: single ngrok URL (proxy frontend and backend)

You can use one ngrok URL and a single port by serving the built React app from Express and pointing both App URL and callback to that ngrok URL. Then:

- `APP_URL` = `FRONTEND_URL` = `https://your-id.ngrok.io`
- App URL in Partner Dashboard = `https://your-id.ngrok.io`
- Redirect URL = `https://your-id.ngrok.io/auth/callback`
- Webhooks = `https://your-id.ngrok.io/webhooks/...`

To do this you’d add static serving of `client/dist` in Express and build the client with `npm run build:client`.

## API Overview

- `GET /auth?shop=...` — Start OAuth; redirects to Shopify permission screen.
- `GET /auth/callback` — OAuth callback; exchanges code for token, stores shop, redirects to frontend.
- `GET /api/billing/check` — Requires session. Returns `hasActivePlan` and optional `confirmationUrl` (test plan).
- `GET /api/billing/return` — Redirect after billing approval; activates charge, redirects to app.
- `GET /api/customers` — List customers (per shop).
- `POST /api/customers/sync` — Sync customers from Shopify into DB.
- `GET /api/customers/:id` — Customer detail with loyalty transactions.
- `PATCH /api/customers/:id` — Update note and/or loyalty points.
- `POST /api/customers/:id/points` — Add a loyalty transaction (body: `{ points, note? }`).
- Webhooks: `POST /webhooks/app/uninstalled`, `customers/data_request`, `customers/redact`, `shop/redact`.

All `/api/*` routes expect either a valid **session token** (Bearer) from App Bridge or `?shop=...` with an installed shop.

## Deploy and submit to the App Store

1. **Backend:** Deploy the Node server (e.g. Render, AWS, DigitalOcean). Set `NODE_ENV=production`, `DATABASE_URL`, `SHOPIFY_*`, `APP_URL`, `FRONTEND_URL` (production URLs).
2. **Frontend:** Build and host the client:
   ```bash
   npm run build:client
   ```
   Serve the `client/dist` output from your chosen host (or the same domain as the backend if you proxy).
3. **Database:** Create the DB and set `DATABASE_URL`. Tables sync automatically when the server starts.
4. **Partner Dashboard:** Set production App URL, redirect URL, and webhook URLs to your live domain(s). Ensure embedded = true and no hardcoded shop domain.
5. **App Store listing:** Complete listing details, privacy policy, support info, and follow [Shopify’s app review requirements](https://shopify.dev/docs/apps/store/review). Use the test billing flow in production until approved.

## Database models (Sequelize)

- **Shop** — `shop_domain`, `access_token`, `scope`, `install_date`, `email`
- **Customer** — `shop_id`, `shopify_customer_id`, `email`, `note`, `loyalty_points`
- **LoyaltyTransaction** — `shop_id`, `customer_id`, `points`, `note`

All scoped by `shopId` for multi-tenancy.

## License

MIT
