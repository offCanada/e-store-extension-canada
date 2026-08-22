# Features

What the extension does today. For how it works internally, start with the codebase map
in [`CONTRIBUTING.md`](../CONTRIBUTING.md) and the store guide in
[`ADDING_A_STORE.md`](ADDING_A_STORE.md).

## For shoppers

| Feature                    | Detail                                                                                                                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Score badges               | **Nutri-Score** (a–e), **Eco-Score** (a+–e), **NOVA group** (1–4) and nutrient-level indicators (fat / saturated fat / sugar / salt: low–moderate–high), shown as official SVGs. Rendered on product pages **and** inline on product listing cards. |
| Product details modal      | Click any banner for the full picture: product photo, name, brand, size, all scores with plain-language descriptions, and a link to the complete Open Food Facts page.                                                                              |
| Loading & not-found states | Skeleton loader while data is fetched; a friendly "not found" state with a link to contribute the product to Open Food Facts when no match exists.                                                                                                  |
| Similar-match warning      | Products matched by name search instead of an exact barcode are flagged with an amber "similar match" indicator, so approximate results are never mistaken for certain ones.                                                                        |
| Settings popup             | Toggle each store on/off independently; show or hide banners on product pages vs listing views. Changes apply instantly across open tabs — no reload needed.                                                                                        |
| Multi-store support        | Metro (`metro.ca`) via exact barcode lookups against the global Open Food Facts API; Voilà (`voila.ca`) via name-based matching through the Canadian Reference DB.                                                                                  |

## Under the hood

- **Local caching** — lookups are cached in browser storage for 3 days, so revisiting a
  product renders instantly and the public APIs stay unbothered.
- **Lazy loading** — off-screen listing cards only trigger a lookup once scrolled into
  view, keeping page loads fast even on long category pages.
- **SPA resilience** — banners keep appearing as stores load new content via infinite
  scroll or client-side navigation; dedup tracking guarantees one banner per product.
- **Style isolation** — all UI lives in shadow DOM with a single shared stylesheet:
  store CSS can't break our badges and ours can't leak into their pages.

## Demo

<!-- TODO: add screenshots/GIFs to docs/assets/images/ and embed here -->
