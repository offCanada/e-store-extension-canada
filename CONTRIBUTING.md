# Contributing

Thanks for helping! Adding stores is the highest-impact contribution — see
[`docs/ADDING_A_STORE.md`](docs/ADDING_A_STORE.md).

## Setup

[Node.js](https://nodejs.org) 22+, [pnpm](https://pnpm.io) 10+ (pinned):

```bash
git clone https://github.com/offCanada/e-store-extension-canada.git
cd e-store-extension-canada
pnpm install          # postinstall runs `wxt prepare`
```

## Development workflow

```bash
pnpm dev              # Chrome dev server → load .output/chrome-mv3 unpacked
pnpm dev:firefox      # Firefox dev server
pnpm build && pnpm zip        # production Chrome build
pnpm compile && pnpm lint && pnpm format:check   # run before pushing (CI parity)
```

Fixes: `pnpm lint:fix`, `pnpm format`.

## Codebase map

- `entrypoints/` — background worker, content-script bootstrap, popup app (WXT)
- `src/runtime/` — adapter registry + store adapters, Orchestrator render loop, DOM/visibility observers, shadow-DOM rendering, element dedup tracker
- `src/components/` — Preact UI (banners, modal, popup) · `src/services/` — product APIs + caching + settings
- `src/types/`, `src/utils/`, `src/Configs.ts` — shared types, helpers, endpoints/TTLs/store keys

Key concepts: adapters isolate store DOM from logic; the Orchestrator re-renders on every
debounced DOM mutation and dedups via a data attribute; **all external requests go
through the background worker**; injected UI lives in shadow roots.

## Do not change without discussion

- Cache key scheme (`product_{code | productId | FNV-1a(searchQuery)}`) — invalidates all user caches.
- `data-estore-extension-processed` attribute in `ProcessedElementTracker` — the dedup mechanism.
- Shared `adoptedStyleSheets` styling — never inject `<style>` tags into page DOM.
- Registry-driven generation (`src/runtime/adapter/index.ts`) feeds manifest patterns and settings toggles — don't hardcode hosts elsewhere.

## Related repositories

- [`e-store-extension-core`](https://github.com/offCanada/e-store-extension-core) — shared template; port generic fixes upstream.
- [`e-store-extension-canada-api`](https://github.com/offCanada/e-store-extension-canada-api) — Canada Reference DB on `localhost:8000`; required locally for Voilà work.

## Testing

No automated suite yet. Verify manually per the QA checklist in
[`docs/ADDING_A_STORE.md`](docs/ADDING_A_STORE.md#5-manual-qa-checklist) and attach
screenshots/video to your PR.

## Commits & PRs

PR titles follow [Conventional Commits](https://www.conventionalcommits.org/) (CI-enforced):
`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `style`, `revert`.
The [PR template](.github/pull_request_template.md) requires a description, media for
visual changes, linked issues (`Fixes: #123`), the self-review checklist, and CI green.

## AI usage disclosure & responsibility

- Disclose any LLM/AI assistance in the PR template (tool name + how it was used).
- You own every line you submit — review AI output as critically as a stranger's patch.
- Never paste secrets or personal data into prompts or commits.

## Ideas looking for contributors

- Test infrastructure (vitest/playwright)
- complete preference-based scoring (scaffolded,
  currently disabled)
- more stores
- scraping pipeline for reference-DB
- ci/cd improvements
- anything that brings value

## Help

[Open Food Facts Slack](https://slack.openfoodfacts.org/) → `#askoff-extensions`, or the
[issue tracker](https://github.com/offCanada/e-store-extension-canada/issues/new/choose).
Be kind — contributions must be respectful and welcoming.
