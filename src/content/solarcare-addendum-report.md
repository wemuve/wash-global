# SolarCare addendum — verified acceptance report

## Live page and Google
- Published page verified: `https://wewashglobal.com/solar-panel-cleaning-lusaka` returned HTTP 200 and rendered 9,687 characters of page content in a Googlebot-style browser.
- The requested www URL redirects to the established non-www primary domain. The self-referencing canonical deliberately uses the final non-www address to avoid reintroducing the site's previous conflicting-host indexing problem. No existing domain configuration was changed.
- Verified live title: **Solar Panel Cleaning in Zambia | WeWash SolarCare**; one H1; robots metadata permits indexing; rendered canonical matches the page.
- Root robots.txt allows crawling and references `https://wewashglobal.com/sitemap.xml`.
- Live sitemap: 18 unique public URLs, including SolarCare; existing entries preserved. No supporting SolarCare articles are published yet, so proposed article URLs are not listed.
- Audited lastmod: the generator and sitemap do not contain build-date or current-date lastmod fallbacks. No authoritative per-page content timestamp is available, so lastmod remains omitted rather than fabricated.
- Used HIGHNESS's linked Google Search Console account. Listed verified properties before per-site operations and selected Google's exact returned `https://wewashglobal.com/` property.
- Updated sitemap submission returned HTTP 204. Readback: submitted 2026-11-16 06:44:52 UTC; downloaded 06:44:53 UTC; 18 page URLs and 21 images; zero errors and zero warnings. Deprecated indexed sitemap counts were ignored.
- URL Inspection's Google-index record reported **URL is unknown to Google** before submission. This is not evidence of indexing failure or a live test.
- **Outstanding manual steps:** Search Console's official **Test live URL**, rendered-page review and **Request indexing** are unavailable through the connector API. A Googlebot-style browser check is not those Google operations. Open URL Inspection under the verified WeWash property, inspect the canonical URL, run Test live URL, then Request indexing if eligible. Monitor Page Indexing afterward. No indexing or ranking claim is made.

## Estimator and administrator controls
- Existing calculator extended, not rebuilt. SolarCare selectable at `/quote`, with Home, Business, Industrial, Farm and Partner packages.
- Every package has independent configuration in private `app_settings`, key `solarcare_pricing_v1`. Initial configuration was saved through the signed-in administrator UI and reloaded; all five packages remain **pending**, all primary methods inactive and all money rates blank. These are unknown rates, not zero-priced services.
- Admin → SolarCare Pricing configures mobilisation; panel/m²/kWp/MWp methods and activation; labour; equipment; filtration; transport and return-distance rates; access/contamination; additional services; minimum; recurring/commercial discounts; tax treatment; validity; cost-approval and savings evidence. Only protected administrator roles can read/save configuration through the server handler; guests cannot save or read private settings.
- Rates cannot become approved without pilot-cost evidence, active validated primary methods, explicit charge/minimum/tax values and savings evidence for any recurring discount. Zero is allowed only as an explicit reviewed no-charge value; no operational rates were invented.
- Inputs: package, customer/company, contact details, site, installation category, panels, area, capacity and kWp/MWp unit, mounting, height, access, contamination, water/treatment, transport/distance, labour, equipment, schedule, duration, extras and optional private photo.
- Panel count, surface area and capacity may be unknown. Missing scope produces relevant follow-up questions rather than guessed measurements.
- Server-calculated outputs distinguish assessment from indicative ZMW estimates; show package/site/scope, requirements, line items, exclusions and configured validity. One primary cleaning method is used, preventing panel/area/capacity double charging. Charge lines are added, approved discounts subtracted, minimum applied, and exclusive tax added. Recurring discounts require a non-one-off schedule, contract duration and approved savings evidence.
- Industrial, farm, partnership, multi-storey and high-risk requests go for assessment, even when rates exist. Site-specific administrator quotation overrides are supported against real SolarCare lead references with reason, approver and timestamp; they do not silently confirm payment or booking.
- Existing AI endpoint recognises SolarCare before its unrelated pricing prompt or numeric fallback. It returns the exact required site-assessment message and no monetary price. SolarCare arithmetic uses deterministic approved rates, not model-generated prices. Existing non-SolarCare prompt/rates remain unchanged; legacy gateway transport was moved to the required SDK and its flagged model spelling resolved to the supported catalog ID.

## Tests completed
- **26 automated tests passed, 71 assertions:** existing deterministic tests; all existing service/size base prices; pending approval; pilot evidence; independent package rates; single primary method; unknown and invalid measurements; large/high-risk routing; savings-backed discounts; configured rate changes; ZMW cents; minimum and tax.
- Browser: all five packages available; no approved rates returned the exact required message and no monetary total; missing measurements accepted.
- Real guest enquiry submitted from SolarCare inside the existing estimator; saved row was read back with structured scope. Signed-in administrator opened it in Leads and saw the scope. Test row and temporary admin grant were removed.
- Administrator saved/reloaded the initial pending configuration through the real UI. Guest save was blocked; guest settings query returned zero rows.
- Signed-in call to the legacy AI estimator with SolarCare returned `estimatedPrice: null` and the required assessment message.
- Live `/quote` verified to include the SolarCare option after publication.
- Mobile 390-pixel layout had no horizontal overflow; screenshots of the estimator and administrator page inspected. No browser page errors; latest preview build signal successful.

## Limitations and remaining acceptance items
- Actual pilot costs and approved SolarCare rates are still needed from WeWash; until then monetary estimates are intentionally unavailable. Synthetic rates were tested in unit tests only, never deployed as customer rates.
- Full production money-generating approval and custom override flows were not exercised with invented operational rates or customer enquiries. Their calculation rules have automated coverage; initial pending save/readback was exercised end-to-end.
- Existing booking integrations were preserved, and every existing deterministic service price was asserted. A fresh real booking/payment and non-SolarCare paid AI inference were not executed; those end-to-end checks remain unverified.
- No continuously scheduled Search Console monitor was introduced; status can be read on request, and the manual indexing request remains outstanding.
- Optional photo handling was verified in the original SolarCare implementation; the addendum enquiry test used no attachment. Owner email notification remains blocked on verified email-sending setup; leads are stored in Admin → Leads.
- Static hosting uses client-rendered route metadata/content. Googlebot-style rendering was verified, but Google's own rendered-page test remains manual. Non-JavaScript social crawlers still see sitewide fallback metadata.
- New pricing endpoints and saved initial settings are live in the shared backend. No unrelated prices, routes or domain settings were changed.

Workflow reference: **lead-capture-forms**.