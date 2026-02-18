# Loyalty & Notes – Theme App Extension

This extension prints **"hello"** on the storefront. Use the app embed to show it on **all pages** of the store, or use the app block to show it only where you add it.

## Show "hello" on ALL pages of the store

1. **Deploy the extension** (from project root):
   ```bash
   shopify app deploy
   ```
   Or only the extension:
   ```bash
   shopify app deploy --only-extensions
   ```

2. **Enable the app embed** (one-time):
   - Go to **Online Store → Themes → Customize**.
   - In the left sidebar, click **Theme settings** (gear icon at the bottom).
   - Open **App embeds**.
   - Find **"Hello (all pages)"** (under your app name) and **enable** it.
   - Click **Save**.

After that, **"hello"** is printed on every page of the store (home, collection, product, cart, etc.), wherever the theme supports app embeds.

## What’s included

| Block | Purpose |
|-------|--------|
| **Hello (all pages)** (app embed) | Enable in App embeds → "hello" on **all pages**. |
| **Hello (customer account)** (app embed) | Enable in App embeds → "hello" **only on customer account pages** (account, orders, addresses, login, register, etc.). |
| **Hello** (app block) | Add to specific sections (header, footer, product, etc.) where you want "hello". |

### Show "hello" only on customer account

1. Deploy: `shopify app deploy`
2. **Online Store → Themes → Customize** → **Theme settings** → **App embeds**.
3. Enable **"Hello (customer account)"** → Save.

"hello" will then appear only when a visitor is on a customer account page (e.g. /account, /account/orders, /account/addresses, login, register).

## Deploy commands

From the **project root**, with [Shopify CLI](https://shopify.dev/docs/apps/tools/cli) installed and linked to your app:

```bash
shopify app deploy
```

Deploy only this extension:

```bash
shopify app deploy --only-extensions
```

## Where "hello" appears

- **App embed "Hello (all pages)"**  
  Rendered before `</body>` on every page when enabled. No need to add it per template.

- **App block "Hello"**  
  Add it in the theme editor to any section that supports app blocks (e.g. header, footer, main content) on any template where you want "hello".
