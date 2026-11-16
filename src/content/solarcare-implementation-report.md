# WeWash SolarCare — implementation and QA report

## Delivered
1. **New page:** `/solar-panel-cleaning-lusaka`; canonical `https://wewashglobal.com/solar-panel-cleaning-lusaka`.
2. **Navigation:** SolarCare in shared desktop and mobile navigation, footer service links, homepage service listing and Services page. Existing URLs remain unchanged. Header spacing was adjusted; mobile menu scrolls on short screens and retains sign-in access.
3. **Packages:** SolarCare Home, Business, Industrial, Farm and Partner. All use site-specific quotations; no fixed prices were invented. All five have enquiry actions that preselect the package.
4. **Enquiries:** dedicated validated form, optional panel count/capacity, installation type, package, recurring schedule, contact consent and optional JPG/PNG/WebP photo (5 MB limit). Server validation, image signature checks and an authenticated staff-only photo endpoint are included.
5. **Routing:** enquiries are stored in the existing `leads` workflow. Sources distinguish residential, commercial, utility-scale and partnership enquiries. Full details are in `message` and structured `notes.solarcare`; `/admin` → Leads now opens enquiry details and private photos with a WhatsApp follow-up action. No automatic booking, price or payment confirmation occurs.
6. **Contextual references:** Services sections for Home Cleaning (which includes post-construction), Office & Commercial Cleaning, and Facility Management link to SolarCare with relevant panel/site-care context. Existing content was searched for solar, industrial, post-construction and infrastructure subjects; unrelated pages and family articles were not keyword-stuffed.
7. **SEO:** exact requested title and description, one H1, H2/H3 sections, canonical, Open Graph and Twitter tags, visible breadcrumb, FAQ content and useful package/industry copy. Zambia’s 10,000 MW target was checked in the original National Energy Compact and clearly identified as total national generation capacity, not solar-only capacity.
8. **Structured data:** Service and package OfferCatalog reference the existing Organization identity; BreadcrumbList describes this page. No duplicate business entity, invented prices, ratings or unsupported nationwide delivery claim was added. FAQPage markup was deliberately not added because this commercial cleaning page does not meet Google’s restricted FAQ rich-result eligibility.
9. **Sitemap:** SolarCare added; generated sitemap now lists 18 routes. Existing robots.txt permits crawling and retains the sitemap directive.
10. **Editorial plan:** eight distinct solar-related article topics, intent, proposed slugs, calls to action and publication checks in `solarcare-editorial-plan.md`. These planned articles have not been published as thin pages.
11. **Analytics:** uses the existing gtag and consent state without adding another tracker. Events: `solarcare_page_view`, `solarcare_package_enquiry`, `solarcare_assessment_submitted`, `solarcare_whatsapp_click`, `solarcare_telephone_click`, `solarcare_partnership_click`, `solarcare_partnership_enquiry`, `solarcare_commercial_enquiry`, `solarcare_utility_scale_enquiry`. No contact details are sent as event properties.

## QA evidence
- 14 automated tests passed, including existing pricing regression tests and SolarCare’s optional count/capacity, consent, routing, quote-only packages and file validation rules.
- Real guest form submission with a photo succeeded; its stored row was read back and had empty panel count/capacity and partnership classification as expected.
- A signed-in temporary manager opened that enquiry through `/admin` → Leads and viewed its private photo. Guests received no lead rows and could not request the private photo.
- Test enquiry, photo and temporary manager access were removed after verification.
- Layout tested at 1440, 1280, 1024, 632 and 390 pixel widths; no horizontal overflow. Mobile SolarCare navigation was opened and clicked. Final mobile and desktop screenshots were inspected.
- Thirteen existing public pages loaded with headings: Home, Services, Pools, Car Detailing, Elderly Support, Quote, Book Now, Pricing, Advice, one family article, Contact, Privacy and Terms. No page errors were observed. Existing booking/quote business logic was not modified; no paid or real customer booking was made.
- SolarCare’s telephone and WhatsApp destinations use the existing +260 768 671 420; all local link destinations in the page are existing routes. Launching a telephone application or completing a real WhatsApp conversation was not tested.
- Latest preview build signal was successful.

## Outstanding limitations
- **Publication:** page changes are in the preview, not the last published website. Google indexing or ranking has not been claimed. The enquiry function and private storage setup are already deployed to the shared backend.
- **Owner emails:** SolarCare enquiries currently reach the admin Leads list, not an email notification. The email health check found no verified project email setup for wewashglobal.com; existing third-party email functionality was preserved but its delivery was not verified. Email notifications need verified sending setup before enabling them for this form.
- **Photos:** no authentic SolarCare photos were supplied. An existing WeWash facility photograph is explicitly captioned as facility-management work, not a SolarCare job. It returned a real JPEG and status 200 on the live domain; the local sandbox could not render that asset-store photo. No generated or stock solar imagery was substituted. No new photo was added to the image library because no new authentic job media was supplied.
- **Search/social rendering:** current static React hosting sends sitewide HTML first; per-page tags and content are applied after JavaScript. Accurate non-JavaScript per-page social previews/server-rendered content are not solved by this addition.
- **Performance:** no new dependencies or third-party tracking scripts were added; page photo is lazy-loaded and existing image is about 108 KB. Field Core Web Vitals and production Lighthouse scores remain unmeasured; no performance score or ranking promise is made.
- **Operational readiness:** industrial, utility-scale and outside-Lusaka work remains subject to confirmed scope, safety planning, mobilisation and actual service capacity. No certifications, equipment inventory, clients or partnerships were fabricated.

## Recommended Search Console validation after publication
1. Inspect `https://wewashglobal.com/solar-panel-cleaning-lusaka` and use **Test live URL**.
2. Confirm status 200, indexing allowed and a self-referencing Google-visible canonical.
3. Review the rendered page and structured data; request indexing if the live test is eligible.
4. Resubmit `https://wewashglobal.com/sitemap.xml` and confirm SolarCare is discovered.
5. Monitor Page Indexing for redirect/canonical/crawl errors and Performance for genuine queries over time. Publishing or sitemap submission does not guarantee indexing or rankings.

Workflow reference used: **lead-capture-forms**.