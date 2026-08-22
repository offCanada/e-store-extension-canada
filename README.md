# NutriLens — Open Food Facts E-Store Extension for Canada

[![CI](https://github.com/offCanada/e-store-extension-canada/actions/workflows/ci.yml/badge.svg)](https://github.com/offCanada/e-store-extension-canada/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<!-- TODO: replace with a real screenshot/GIF once captured (docs/assets/images/) -->

**NutriLens — Your Health Lens.** A browser extension that overlays Open Food Facts
data — **Nutri-Score**, **Eco-Score**, **NOVA group** and nutrient-level badges — onto
Canadian online grocery stores while you shop.

A country-specific fork of
[`e-store-extension-core`](https://github.com/offCanada/e-store-extension-core), part of
the [Open Food Facts](https://world.openfoodfacts.org) ecosystem.

## Supported stores

| Store | Site       | Data source                                                                          |
| ----- | ---------- | ------------------------------------------------------------------------------------ |
| Metro | `metro.ca` | Global [Open Food Facts](https://world.openfoodfacts.org) API                        |
| Voilà | `voila.ca` | [Canada Reference DB API](https://github.com/offCanada/e-store-extension-canada-api) |

> **Voilà note:** requires the companion
> [`e-store-extension-canada-api`](https://github.com/offCanada/e-store-extension-canada-api)
> (currenlty local environment only)

## How it works

1. A content script detects products on store pages (one adapter per store).
2. The background worker looks up scores from Open Food Facts APIs and caches them
   locally for 3 days.
3. Badges render in an isolated shadow DOM; click a banner for full product details.

Full feature list: [`docs/FEATURES.md`](docs/FEATURES.md).

## Installation

Requires [Node.js](https://nodejs.org) 22+ and [pnpm](https://pnpm.io) 10+. The extension
is not yet on the Chrome Web Store / AMO, so you run a local build:

```bash
git clone https://github.com/offCanada/e-store-extension-canada.git
cd e-store-extension-canada
pnpm install
pnpm build            # Chrome → .output/chrome-mv3/
pnpm build:firefox    # Firefox → .output/firefox-mv3/
```

- **Chrome:** `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select `.output/chrome-mv3`
- **Firefox:** `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → select `manifest.json` inside `.output/firefox-mv3`

Then open the popup to configure settings and browse a supported store — badges appear
automatically; click one for details.

## Scores & data

Scores are pre-computed by Open Food Facts — not by this extension:

- **Nutri-Score** (a–e), **Eco-Score** (a+–e), **NOVA group** (1–4), nutrient levels
  (fat/saturated fat/sugar/salt).
- Products matched by name instead of barcode show an amber "similar match" warning.

Data © Open Food Facts contributors, licensed under
[ODbL](https://opendatacommons.org/licenses/odbl/).

**Privacy:** no analytics or tracking. Runs only on configured store domains and talks
only to Open Food Facts endpoints. Cache and settings
stay in browser-local storage.

## Development

```bash
pnpm dev              # Chrome dev server with auto-reload
pnpm dev:firefox      # Firefox dev server
pnpm compile && pnpm lint && pnpm format:check   # CI-parity checks
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md). To add support for a new store, follow
[`docs/ADDING_A_STORE.md`](docs/ADDING_A_STORE.md).

## Community

- Bugs & features: [open an issue](https://github.com/offCanada/e-store-extension-canada/issues/new/choose)
- Questions: [Open Food Facts Slack](https://slack.openfoodfacts.org/) → `#askoff-extensions`
- Security issues: report privately via [GitHub security advisories](https://github.com/offCanada/e-store-extension-canada/security/advisories/new)

## License

Code: [MIT](LICENSE). Product data: ODbL via Open Food Facts.
