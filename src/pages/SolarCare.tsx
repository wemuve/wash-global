import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sun, Building2, Factory, Sprout, Home, Handshake, ShieldCheck, ClipboardList, Phone, MessageCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SolarCareEnquiryForm from '@/components/solarcare/SolarCareEnquiryForm';
import { solarPackages, SOLARCARE_PATH, SolarEnquiry, serviceFrequencies } from '@/data/solarcare';
import { trackSolarCare } from '@/lib/solarcareAnalytics';
import facilityWindows from '@/assets/services/facility-windows.jpeg.asset.json';

const title = 'Solar Panel Cleaning Lusaka, Zambia | WeWash SolarCare';
const description = 'Solar panel cleaning in Lusaka for homes and businesses. Scheduled cleaning and visual site reports from WeWash SolarCare. Request a site-specific quotation.';
const url = `https://wewashglobal.com${SOLARCARE_PATH}`;
const industries = [
  { name: 'Residential solar', icon: Home, package: 'home', detail: 'Care for home rooftop installations, with access and roof safety checked before a visit.' },
  { name: 'Commercial solar', icon: Building2, package: 'business', detail: 'Cleaning schedules for offices, hotels, shopping centres and schools, planned around building operations.' },
  { name: 'Industrial solar', icon: Factory, package: 'industrial', detail: 'Site-specific programmes for manufacturing plants, mines and industrial facilities, subject to scope and safety assessment.' },
  { name: 'Agricultural solar', icon: Sprout, package: 'industrial', detail: 'Cleaning proposals for farm installations exposed to dust, organic debris and changing seasonal conditions.' },
  { name: 'Utility-scale solar farms', icon: Sun, package: 'farm', detail: 'Assessment-led proposals for panel blocks and operator-managed sites. Mobilisation and delivery capacity are agreed before contracting.' },
  { name: 'Solar installation companies', icon: Handshake, package: 'partner', detail: 'Discuss outsourced cleaning, post-installation handover support and recurring client care with your project team.' },
] as const;
const process = [
  ['Site assessment', 'Review the installation, contamination, access, water supply and site operating requirements.'],
  ['Cleaning method and safety planning', 'Agree a method, suitable water quality and access arrangements in line with manufacturer recommendations and site requirements. Unsafe access is not accepted.'],
  ['Professional panel cleaning', 'Clean accessible panel surfaces using the agreed method. Avoid abrasive tools, unsuitable chemicals and thermal shock; electrical isolation is handled by qualified personnel where required.'],
  ['Post-cleaning visual verification', 'Check accessible surfaces and record visible damage or obstructions. This is a visual check, not an electrical diagnostic or performance test.'],
  ['Digital service reporting', 'Provide completion notes and agreed before-and-after photographs, with any observations for the owner or qualified solar technician.'],
];
const faqs = [
  ['Why should solar panels be cleaned?', 'Dust, bird droppings and other deposits can block light reaching photovoltaic cells. Removing contamination helps keep panel surfaces clear; actual generation depends on many factors and no fixed improvement is promised.'],
  ['How often should solar panels be cleaned in Zambia?', 'There is no universal schedule. Dust exposure, bird activity, rainfall, manufacturer guidance and site requirements determine the right frequency. We can discuss one-off, monthly, quarterly or custom programmes after assessment.'],
  ['Do you clean commercial solar installations?', 'Commercial enquiries are welcome, including offices, hotels and shopping centres. Scope, access, safety planning and service availability are confirmed before any work is booked.'],
  ['Do you provide solar farm cleaning?', 'We welcome solar farm and operator enquiries for site surveys and cleaning programme proposals. Utility-scale delivery is subject to site assessment, mobilisation planning and confirmed capacity; it is not an automatic online booking.'],
  ['Can solar installation companies outsource cleaning to WeWash?', 'Yes, we invite installers and EPC contractors to discuss subcontracted cleaning, handover preparation and ongoing client care. Responsibilities, capability and service terms must be agreed in a partnership arrangement.'],
  ['Do you provide recurring maintenance contracts?', 'Scheduled cleaning agreements can be discussed for monthly, quarterly, annual or custom arrangements. Frequency and scope are tailored to the site; maintenance support here means cleaning and site care, not electrical maintenance.'],
  ['Do you provide before-and-after reports?', 'The Home and Business packages include before-and-after photographs. Digital completion or cleaning reports are included in the relevant packages, with the exact documentation agreed before service.'],
  ['Do you provide electrical repairs?', 'No. SolarCare provides cleaning and visual reporting, not electrical engineering, diagnostics or technical repairs. Electrical issues should be assessed by a qualified solar technician. Monitoring coordination is only arranged with qualified personnel.'],
  ['Do you operate outside Lusaka?', 'We are based in Kabulonga, Lusaka. Larger projects elsewhere in Zambia are subject to assessment, mobilisation and service availability. We do not claim an established nationwide delivery network.'],
  ['How can I request a quotation?', 'Complete the site assessment form or contact +260 768 671 420 on WhatsApp or by telephone. You can submit without knowing panel count or installed capacity. All SolarCare prices are site-specific and confirmed by our team.'],
];

export default function SolarCare() {
  const [preferredPackage, setPreferredPackage] = useState<SolarEnquiry['package']>('home');
  useEffect(() => { trackSolarCare('page_view', { page_path: SOLARCARE_PATH }); }, []);
  const enquire = (value: SolarEnquiry['package'], context: string) => {
    setPreferredPackage(value);
    trackSolarCare('package_enquiry', { package: value, context });
    if (value === 'partner') trackSolarCare('partnership_click', { context });
    document.getElementById('solar-assessment')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    document.getElementById('solar-customerName')?.focus({ preventScroll: true });
  };
  return (
    <Layout>
      <Helmet>
        <title>{title}</title><meta name="description" content={description} /><link rel="canonical" href={url} />
        <meta property="og:title" content={title} /><meta property="og:description" content={description} /><meta property="og:url" content={url} /><meta property="og:type" content="website" />
        <meta name="twitter:title" content={title} /><meta name="twitter:description" content={description} /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:url" content={url} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@graph': [
          {
            '@type': 'Service', '@id': `${url}#service`,
            name: 'WeWash SolarCare — Solar Panel Cleaning in Lusaka',
            serviceType: 'Solar Panel Cleaning & Maintenance Support',
            description: 'Solar panel cleaning, scheduled cleaning programmes and visual site reporting in Lusaka. Industrial and solar farm projects elsewhere in Zambia require assessment, mobilisation and confirmed availability. No electrical repairs or diagnostics.',
            url,
            provider: { '@type': 'Organization', '@id': 'https://wewashglobal.com/#organization', name: 'WeWash Zambia', url: 'https://wewashglobal.com/', telephone: '+260768671420' },
            areaServed: { '@type': 'City', name: 'Lusaka', containedInPlace: { '@type': 'Country', name: 'Zambia' } },
            availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${url}#solar-assessment`, servicePhone: { '@type': 'ContactPoint', telephone: '+260768671420', contactType: 'SolarCare enquiries' } },
            hasOfferCatalog: { '@type': 'OfferCatalog', name: 'SolarCare site-specific quotation packages', itemListElement: solarPackages.map(p => ({ '@type': 'Offer', url: `${url}#solar-assessment`, itemOffered: { '@type': 'Service', name: p.name, description: `${p.audience}. ${p.features.join('; ')}. Subject to assessment and confirmed availability.` } })) },
          },
          { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wewashglobal.com/' }, { '@type': 'ListItem', position: 2, name: 'SolarCare', item: url }] },
        ] })}</script>
      </Helmet>
      <section className="border-b border-border">
        <div className="container-wewash pt-6 pb-12 md:pb-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-10"><Link to="/" className="hover:text-secondary">Home</Link><span aria-hidden="true">/</span><span aria-current="page">SolarCare</span></nav>
          <div className="flex items-center gap-3 text-secondary mb-5"><Sun className="h-7 w-7" /><p className="text-xl font-semibold">WeWash SolarCare</p></div>
          <p className="text-sm text-muted-foreground mb-7">Solar Panel Cleaning &amp; Maintenance Support<br />A WeWash Zambia specialist service division.</p>
          <h1 className="text-3xl md:text-5xl max-w-4xl leading-tight tracking-normal">Professional Solar Panel Cleaning &amp; Maintenance Support in Zambia</h1>
          <p className="text-xl text-secondary mt-6">Keeping Zambia’s Solar Installations Clean and Well Maintained.</p>
          <p className="mt-5 max-w-3xl text-muted-foreground leading-relaxed">Professional solar panel cleaning, scheduled maintenance support and documented site-care services for residential, commercial, industrial and utility-scale solar installations.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-7"><Button className="btn-gold h-auto whitespace-normal" onClick={() => enquire('home', 'hero')}>Request a Solar Site Assessment<ArrowRight className="h-4 w-4 ml-2 shrink-0" /></Button><Button variant="outline" className="h-auto whitespace-normal" onClick={() => enquire('partner', 'hero')}>Discuss a Commercial Partnership</Button></div>
          <p className="text-xs text-muted-foreground mt-5">Lusaka-based. Projects outside Lusaka require assessment, mobilisation and confirmed service availability.</p>
        </div>
      </section>

      <section className="py-14 md:py-20"><div className="container-wewash grid md:grid-cols-2 gap-10 items-center">
        <div><p className="text-secondary text-sm mb-3">Panel care, planned around your site</p><h2 className="tracking-normal">Why solar panel cleaning matters</h2><p className="text-muted-foreground mt-5 leading-relaxed">Dust accumulation, bird droppings, leaves and organic debris can shade panel surfaces. Industrial pollution, environmental contamination and mineral deposits can also reduce light reaching photovoltaic cells and affect generation.</p><p className="text-muted-foreground mt-4 leading-relaxed">Cleaning is one part of site care, not a promise of fixed energy savings. Frequency depends on actual contamination, site conditions, manufacturer guidance and operational requirements.</p></div>
        <figure><img src={facilityWindows.url} alt="Modern windowed corridor from WeWash’s existing facility-management photography" className="w-full aspect-[4/3] object-cover rounded-lg" loading="lazy" /><figcaption className="text-xs text-muted-foreground mt-3">WeWash facility-management photography. This is not a SolarCare project; verified solar job photos will be added when available.</figcaption></figure>
      </div></section>

      <section id="solar-packages" className="py-14 md:py-20 bg-card border-y border-border"><div className="container-wewash"><p className="text-secondary text-sm mb-3">Five ways to work with SolarCare</p><h2 className="tracking-normal">Our service packages</h2><p className="max-w-3xl text-muted-foreground mt-4">Each package is a scope for discussion, not a fixed-price promise. Access, water quality, installation size, safety and delivery capacity are assessed before we confirm your quotation.</p><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">{solarPackages.map((p, i) => <article key={p.id} className="rounded-lg border border-border bg-background p-6 flex flex-col"><p className="text-secondary text-sm mb-3">PACKAGE 0{i + 1}</p><h3 className="tracking-normal">{p.name}</h3><p className="text-muted-foreground text-sm mt-3 mb-5">{p.audience}</p><ul className="space-y-3 mb-7">{p.features.map(feature => <li key={feature} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />{feature}</li>)}</ul><p className="text-sm text-secondary mt-auto mb-4">Request a Site-Specific Quotation.</p><Button variant="outline" className="w-full h-auto whitespace-normal" onClick={() => enquire(p.id, 'package')}>{p.id === 'partner' ? 'Discuss a partnership' : `Enquire about ${p.name.replace('SolarCare ', '')}`}<ArrowRight className="h-4 w-4 ml-2 shrink-0" /></Button></article>)}</div></div></section>

      <section className="py-14 md:py-20"><div className="container-wewash grid md:grid-cols-2 gap-12"><div><h2 className="tracking-normal">Additional site-care services</h2><p className="text-muted-foreground mt-4">Optional work is assessed separately and included only where suitable resources and access arrangements can be confirmed.</p><ul className="mt-6 space-y-3">{['Bird dropping removal', 'Vegetation management', 'Debris removal', 'Agreed roof and access-area cleaning', 'Water filtration and water-quality management', 'Performance monitoring coordination with qualified solar technicians'].map(item => <li key={item} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />{item}</li>)}</ul></div><div className="border-l-2 border-secondary pl-6"><ShieldCheck className="h-8 w-8 text-secondary mb-4" /><h3 className="tracking-normal">Cleaning and visual reporting — not electrical repair</h3><p className="text-muted-foreground mt-4 leading-relaxed">We do not provide electrical engineering, diagnostics or technical repairs through SolarCare. Visible damage is recorded for the owner to refer to a qualified solar technician. Rooftop and utility-scale work is accepted only after safe access, site responsibilities and service availability are agreed.</p></div></div></section>

      <section className="py-14 md:py-20 border-y border-border"><div className="container-wewash"><h2 className="tracking-normal">Our cleaning process</h2><ol className="grid md:grid-cols-2 xl:grid-cols-5 gap-8 mt-10">{process.map(([name, detail], i) => <li key={name}><p className="text-secondary text-sm mb-4">0{i + 1}</p><h3 className="text-lg tracking-normal">{name}</h3><p className="text-sm text-muted-foreground mt-3 leading-relaxed">{detail}</p></li>)}</ol></div></section>

      <section className="py-14 md:py-20"><div className="container-wewash"><h2 className="tracking-normal">Industries we support</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 mt-10">{industries.map(item => <article key={item.name} className="border-t border-border pt-6"><item.icon className="h-7 w-7 text-secondary mb-4" /><h3 className="text-xl tracking-normal">{item.name}</h3><p className="text-sm text-muted-foreground mt-3 mb-4 leading-relaxed">{item.detail}</p><Button variant="link" className="p-0 text-secondary h-auto whitespace-normal" onClick={() => enquire(item.package, 'industry')}>Discuss your installation<ArrowRight className="h-4 w-4 ml-2" /></Button></article>)}</div></div></section>

      <section className="py-14 md:py-20 bg-card border-y border-border"><div className="container-wewash grid md:grid-cols-2 gap-10"><div><ClipboardList className="h-8 w-8 text-secondary mb-5" /><h2 className="tracking-normal">Recurring maintenance agreements</h2><p className="text-muted-foreground mt-5 leading-relaxed">Plan cleaning around your installation, not an arbitrary calendar. Environmental conditions and site requirements determine the appropriate frequency, and annual agreements can set out the agreed schedule, documentation and responsibilities.</p><ul className="space-y-2 mt-5">{serviceFrequencies.map(f => <li key={f} className="text-sm flex gap-2"><Check className="h-4 w-4 text-secondary" />{f}</li>)}</ul><Button variant="outline" className="mt-6" onClick={() => enquire('business', 'recurring')}>Plan a cleaning programme</Button></div><div><h2 className="tracking-normal">Zambia’s energy transformation</h2><p className="text-muted-foreground mt-5 leading-relaxed">Zambia’s National Energy Compact sets an ambition to increase installed electricity generation capacity to 10,000 MW by 2030, primarily through renewable energy sources. This is a target for total national generation capacity — not solar capacity alone.</p><p className="text-muted-foreground mt-4 leading-relaxed">WeWash SolarCare intends to support the growing solar ecosystem through specialist cleaning and site-care services. We do not claim partnerships with government, developers or energy operators unless an agreement is formally established.</p><a className="inline-block mt-5 text-sm text-secondary underline" href="https://www.worldbank.org/content/dam/theworldbankgroupasset/document/2026/m300-energy-compacts/Zambia-M300-AES-Compact.pdf" target="_blank" rel="noopener noreferrer">Read Zambia’s National Energy Compact (World Bank, PDF)</a></div></div></section>

      <section id="solar-partnerships" className="py-14 md:py-20"><div className="container-wewash max-w-4xl"><p className="text-secondary mb-4">Commercial partnerships</p><h2 className="tracking-normal">Your Solar Projects. Our Cleaning and Site-Care Support.</h2><p className="text-muted-foreground mt-5 leading-relaxed">For solar EPC contractors, installation companies, renewable energy developers, equipment suppliers, independent power producers, commercial property managers and industrial operators: discuss a cleaning and documentation scope that fits your project. Subcontracting, handover support and recurring arrangements are agreed case by case.</p><Button className="btn-gold mt-7 h-auto whitespace-normal" onClick={() => enquire('partner', 'partnership')}>Become a WeWash SolarCare Partner<Handshake className="h-4 w-4 ml-2 shrink-0" /></Button></div></section>

      <section className="py-14 md:py-20 border-y border-border"><div className="container-wewash max-w-4xl"><h2 className="tracking-normal mb-6">SolarCare questions</h2><Accordion type="single" collapsible>{faqs.map(([question, answer], i) => <AccordionItem key={question} value={`faq-${i}`}><AccordionTrigger className="text-left">{question}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-relaxed">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>

      <section id="solar-assessment" className="py-14 md:py-20 scroll-mt-24"><div className="container-wewash grid lg:grid-cols-[1fr_1.5fr] gap-12"><div><p className="text-secondary mb-4">Let’s discuss your site</p><h2 className="tracking-normal">Request a Solar Site Assessment</h2><p className="text-muted-foreground mt-5 leading-relaxed">Tell us about your installation. Commercial, utility-scale and partnership enquiries are flagged separately for the team’s follow-up.</p><p className="text-muted-foreground mt-4 leading-relaxed">Based at D13 Antelope Close, Kabulonga, Lusaka 10101. Outside-Lusaka enquiries are subject to assessment, mobilisation and service availability.</p><div className="flex flex-col items-start gap-4 mt-7"><Button asChild variant="outline"><a href="https://wa.me/260768671420?text=Hello%20WeWash%20SolarCare%2C%20I%20would%20like%20to%20discuss%20solar%20panel%20cleaning." target="_blank" rel="noopener noreferrer" onClick={() => trackSolarCare('whatsapp_click', { context: 'assessment' })}><MessageCircle className="h-4 w-4 mr-2" />WhatsApp SolarCare</a></Button><a className="flex items-center gap-2 text-secondary" href="tel:+260768671420" onClick={() => trackSolarCare('telephone_click')}><Phone className="h-4 w-4" />+260 768 671 420</a><a className="text-sm text-muted-foreground underline break-all" href="mailto:booking@wewashglobal.com">booking@wewashglobal.com</a></div></div><SolarCareEnquiryForm preferredPackage={preferredPackage} onPackageChange={setPreferredPackage} /></div></section>
    </Layout>
  );
}