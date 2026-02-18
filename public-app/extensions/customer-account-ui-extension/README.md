# Customer account UI Extension

## Prerequisites

Before you start building your extension, make sure that you’ve created a [development store](https://shopify.dev/docs/apps/tools/development-stores) with the [Checkout and Customer Accounts Extensibility](https://shopify.dev/docs/api/release-notes/developer-previews#previewing-new-features).

## Blocks in this extension

- **Order status block** (`OrderStatusBlock.jsx`) – Renders on the order status page (earn points message).
- **Profile “Hello” block** (`ProfileBlockHello.jsx`) – Renders “Hello” on the customer account **Profile** section. To show it: in Shopify go to the customer account configuration (Profile → Main → **+ Add block**), choose this extension, and add the profile block.

## Your new Extension

Your new extension contains the following files:

- `README.md`, the file you are reading right now.
- `shopify.extension.toml`, the configuration file for your extension. This file defines your extension’s name.
- `src/*.jsx`, the source code for your extension.
- `locales/en.default.json` and `locales/fr.json`, which contain translations used to [localized your extension](https://shopify.dev/docs/apps/checkout/best-practices/localizing-ui-extensions).

## Useful Links

- [Customer account UI extension documentation](https://shopify.dev/docs/api/customer-account-ui-extensions)
  - [Configuration](https://shopify.dev/docs/api/customer-account-ui-extensions/unstable/configuration)
  - [API Reference](https://shopify.dev/docs/api/customer-account-ui-extensions/unstable/apis)
  - [UI Components](https://shopify.dev/docs/api/customer-account-ui-extensions/unstable/components)
