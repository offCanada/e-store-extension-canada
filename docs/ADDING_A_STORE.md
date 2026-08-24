# Adding a new store

The highest-impact contribution. One adapter class + one registry entry — match
patterns, manifest hosts, and popup settings toggles are generated automatically.

## 1. Recon the site (DevTools)

- **Product page:** stable wrapper selector; banner injection point (usually before the title); hunt for a **barcode** (`data-*` attributes, JSON-LD `<script type="application/ld+json">`, embedded app state). Barcodes = exact matches.
- **Listing cards:** selector matching every card; per-card id/barcode/name/brand/size.
- Note SPA routing / infinite scroll quirks (the Orchestrator handles most of it).

## 2. Implement the adapter

Create `src/runtime/adapter/stores/NewStoreAdapter.ts` extending
[`StoreAdapter`](../src/runtime/adapter/StoreAdapter.ts):

```ts
export class NewStoreAdapter extends StoreAdapter {
  readonly store = STORE_KEYS.newstore; // add the key to STORE_KEYS in src/configs.ts
  readonly structure = {
    productView: {
      productElementSelector: '…',
      uiInjectionElementSelector: '…', // banner anchor
      product: { id, barcode, name, brand, quantity }, // extractors (Element) => string | null
    },
    listView: {
      /* same shape */
    },
  };

  // Only banner injection is store-specific:
  injectViewItemBanner(target: Element): Element;
  injectListItemBanner(target: Element): Element;

  // Optional hook — default builds "brand name quantity" from the extractors:
  // protected override buildSearchQuery(element, view): string | null
}
```

Existence checks, element retrieval and `StoreProduct` extraction are **inherited** —
the base class implements them entirely from your `structure`. Reference
implementations: [`MetroAdapter`](../src/runtime/adapter/stores/MetroAdapter.ts),
[`VoilaAdapter`](../src/runtime/adapter/stores/VoilaAdapter.ts).

## 3. Register the store

Append one entry to `src/runtime/adapter/index.ts` — this single record drives content-script
match patterns, popup settings toggles, hostname resolution and data-source wiring:

```ts
{
  key: STORE_KEYS.newstore,        // stable id for messages, cache keys, settings
  name: 'NewStore',                // display name in popup settings
  hostname: 'www.newstore.ca',     // exact hostname — resolution is exact-match!
  match: '*://*.newstore.ca/*',
  adapter: NewStoreAdapter,
  provider: OpenFoodFactsApi,      // see table below
}
```

| Situation             | Provider                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Barcodes / search     | `OpenFoodFactsApi` — uses OFF product api & search api                                                         |
| Product Id / barcodes | `OFFCanadaApi` — Canada Reference DB; [Product API](https://github.com/offCanada/e-store-extension-canada-api) |

New providers require an issue discussion first.

## 4. Manual QA checklist

- [ ] PDP: banner appears once, correct scores, no layout breakage.
- [ ] Listing: exactly one banner per visible card (dedup works).
- [ ] Infinite scroll / pagination / SPA navigation: new cards get banners, no ghosts or duplicates.
- [ ] Settings toggle off/on hides and restores banners live.
- [ ] Revisiting a product renders instantly from cache.
- [ ] Fuzzy matches show the amber "similar match" warning (if applicable).
- [ ] Spot-check with `pnpm dev:firefox`.
- [ ] No new console errors/warnings.

## PR checklist

- `pnpm compile && pnpm lint && pnpm format:check && pnpm test` green
- QA evidence attached ·
- Conventional Commits and PR title (e.g. `feat: support acme.ca store`)
- AI assistance disclosed per template.
