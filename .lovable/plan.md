# Remove `wash-global.lovable.app` from Google search results

## Goal
Stop Google from showing the Lovable subdomain (`wash-global.lovable.app`) when people search for WeWash, so only the professional custom domain (`wewashglobal.com`) appears.

## Why both URLs are indexed
Lovable-published projects always have a `*.lovable.app` URL alongside any custom domain. Google discovers and indexes both unless we explicitly tell it to prefer one and remove the other.

## Plan

### 1. Force canonical consolidation to `wewashglobal.com`
- Ensure every public route already has a `<link rel="canonical" href="https://wewashglobal.com/<route>" />` via `react-helmet-async`.
- Add a small script in `index.html` that detects the Lovable host and:
  - Injects `<meta name="robots" content="noindex, nofollow">` immediately, so Google drops any already-crawled `lovable.app` URLs.
  - Optionally redirects real visitors to the matching page on `wewashglobal.com`.

### 2. Use Google Search Console Removals tool
- Add `https://wash-global.lovable.app/` as a separate URL-prefix property in Search Console (verification via META tag, similar to the main domain).
- Submit a temporary removal request for the entire `wash-global.lovable.app` property.
- This does not delete the Lovable URL itself — it only removes it from Google search results.

### 3. Add a public redirect/noindex guard in the source
- Since the same static build serves both domains, implement host-aware logic in `index.html` or in a small early-render component.
- Keep all existing `wewashglobal.com` canonicals unchanged.

### 4. Verify and monitor
- Re-inspect both the homepage and `/book-now` on the `wewashglobal.com` Search Console property after publishing.
- Wait for the removal request and canonical signals to take effect (typically days to a few weeks).

## What we will change in code
- `index.html`: add a domain-detection script for `wash-global.lovable.app` that injects `noindex` and redirects to `wewashglobal.com`.
- Optional: create `_redirects` or equivalent only if Lovable hosting supports server-side redirects (to be confirmed).

## What needs to happen outside the codebase
- Verify `https://wash-global.lovable.app/` in Search Console.
- Submit the URL removal request for the Lovable subdomain.
