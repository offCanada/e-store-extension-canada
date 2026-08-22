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
  readonly store = stores.newstore; // add key in src/Configs.ts
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
  // implement: doesProductViewExist/doesProductListExist,
  // getProductViewElement/getProductListElements,
  // getDataFromProductViewElement/getDataFromProductListElement → StoreProduct,
  // injectViewItemBanner/injectListItemBanner → shadow-root container
}
```

Reference implementations: [`MetroAdapter`](../src/runtime/adapter/stores/MetroAdapter.ts), [`VoilaAdapter`](../src/runtime/adapter/stores/VoilaAdapter.ts).

## 3. Choose the data source

| Situation             | Provider                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Barcodes / search     | `OpenFoodFactsApi` — uses OFF product api & search api                                                         |
| Product Id / barcodes | `OFFCanadaApi` — Canada Reference DB; [Product API](https://github.com/offCanada/e-store-extension-canada-api) |

Wire it in two places: add the store key to `stores` in `src/Configs.ts`, and map it in
`SourceFactory.create()`. New providers require an issue discussion first.

## 4. Register the store

Append to `src/runtime/adapter/index.ts`:

```ts
{
  name: 'NewStore',                // display name in popup settings
  hostname: 'www.newstore.ca',     // exact hostname — resolution is exact-match!
  match: '*://*.newstore.ca/*',
  adapter: NewStoreAdapter,
}
```

## 5. Manual QA checklist

- [ ] PDP: banner appears once, correct scores, no layout breakage.
- [ ] Listing: exactly one banner per visible card (dedup works).
- [ ] Infinite scroll / pagination / SPA navigation: new cards get banners, no ghosts or duplicates.
- [ ] Settings toggle off/on hides and restores banners live.
- [ ] Revisiting a product renders instantly from cache.
- [ ] Fuzzy matches show the amber "similar match" warning (if applicable).
- [ ] Spot-check with `pnpm dev:firefox`.
- [ ] No new console errors/warnings.

## PR checklist

- `pnpm compile && pnpm lint && pnpm format:check` green
- QA evidence attached ·
- Conventional Commits and PR title (e.g. `feat: support acme.ca store`)
- AI assistance disclosed per template.
