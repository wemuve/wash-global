/**
 * WeWash deterministic pricing engine (ZMW).
 *
 * Single source of truth for every estimate shown on the site.
 *
 * Formula (applied once, in this order):
 *   adjustedBase = basePrice * conditionMultiplier
 *   subtotal     = adjustedBase + fixed add-ons
 *   total        = subtotal + transport
 *
 * The condition multiplier NEVER applies to add-ons or transport.
 */

export type ServiceMode = 'mobile' | 'dropoff';

export interface ServiceSize {
  id: string;
  label: string;
  base: number;
}

export interface ServiceDefinition {
  id: string;
  label: string;
  sizes: ServiceSize[];
  addOnIds: string[];
  /** Drop-off at our Kabulonga base is possible (cars only). */
  allowsDropOff: boolean;
}

export interface AddOnDefinition {
  id: string;
  label: string;
  amount: number;
}

export interface ConditionDefinition {
  id: string;
  label: string;
  multiplier: number;
}

export const CONDITIONS: ConditionDefinition[] = [
  { id: 'light', label: 'Light / Well-maintained', multiplier: 1.0 },
  { id: 'moderate', label: 'Moderate dirt', multiplier: 1.2 },
  { id: 'heavy', label: 'Heavy dirt / Neglected', multiplier: 1.4 },
  { id: 'post-construction', label: 'Post-construction debris', multiplier: 1.6 },
];

export const ADD_ONS: AddOnDefinition[] = [
  { id: 'seat-removal', label: 'Seat Removal', amount: 150 },
  { id: 'engine-bay', label: 'Engine Bay Clean', amount: 200 },
  { id: 'headlight-restore', label: 'Headlight Restoration', amount: 250 },
  { id: 'windows-interior', label: 'Interior Windows (up to 10)', amount: 350 },
  { id: 'windows-exterior', label: 'Exterior Windows (up to 10)', amount: 500 },
  { id: 'sofa-clean', label: 'Sofa / Upholstery Clean (3-seater)', amount: 400 },
  { id: 'carpet-clean', label: 'Carpet Deep Clean (per room)', amount: 300 },
  { id: 'fridge-oven', label: 'Inside Fridge & Oven', amount: 200 },
];

export const SERVICES: ServiceDefinition[] = [
  {
    id: 'general-cleaning',
    label: 'General Cleaning (Interior)',
    allowsDropOff: false,
    addOnIds: ['windows-interior', 'windows-exterior', 'sofa-clean', 'carpet-clean', 'fridge-oven'],
    sizes: [
      { id: '1-bed', label: '1 Bedroom', base: 550 },
      { id: '2-bed', label: '2 Bedroom', base: 700 },
      { id: '3-bed', label: '3 Bedroom', base: 900 },
      { id: '4-bed', label: '4 Bedroom', base: 1100 },
    ],
  },
  {
    id: 'deep-cleaning',
    label: 'Deep Cleaning',
    allowsDropOff: false,
    addOnIds: ['windows-interior', 'windows-exterior', 'sofa-clean', 'carpet-clean', 'fridge-oven'],
    sizes: [
      { id: '1-bed', label: '1 Bedroom', base: 850 },
      { id: '2-bed', label: '2 Bedroom', base: 1200 },
      { id: '3-bed', label: '3 Bedroom', base: 1800 },
      { id: '4-bed', label: '4 Bedroom', base: 2500 },
    ],
  },
  {
    id: 'post-construction',
    label: 'Post-Construction Cleaning',
    allowsDropOff: false,
    addOnIds: ['windows-interior', 'windows-exterior', 'carpet-clean'],
    sizes: [
      { id: '1-bed', label: '1 Bedroom', base: 1500 },
      { id: '2-bed', label: '2 Bedroom', base: 2000 },
      { id: '3-bed', label: '3 Bedroom', base: 2800 },
      { id: '4-bed', label: '4 Bedroom', base: 3500 },
    ],
  },
  {
    id: 'car-interior',
    label: 'Car Detailing – Interior Deep Clean',
    allowsDropOff: true,
    addOnIds: ['seat-removal', 'engine-bay'],
    sizes: [
      { id: 'small', label: 'Small Car / Sedan', base: 450 },
      { id: 'suv', label: 'SUV / 4x4', base: 550 },
    ],
  },
  {
    id: 'car-full',
    label: 'Car Detailing – Full (Interior + Exterior)',
    allowsDropOff: true,
    addOnIds: ['seat-removal', 'engine-bay', 'headlight-restore'],
    sizes: [
      { id: 'small', label: 'Small Car / Sedan', base: 650 },
      { id: 'suv', label: 'SUV / 4x4', base: 850 },
    ],
  },
  {
    id: 'fumigation',
    label: 'Fumigation & Pest Control',
    allowsDropOff: false,
    addOnIds: [],
    sizes: [
      { id: 'residential', label: 'Residential', base: 400 },
      { id: 'commercial', label: 'Commercial', base: 800 },
      { id: 'termite', label: 'Termite Treatment', base: 1200 },
    ],
  },
  {
    id: 'office-cleaning',
    label: 'Office Cleaning',
    allowsDropOff: false,
    addOnIds: ['windows-interior', 'windows-exterior', 'carpet-clean'],
    sizes: [
      { id: 'daily', label: 'Daily (per day)', base: 200 },
      { id: 'weekly', label: 'Weekly', base: 800 },
      { id: 'monthly', label: 'Monthly', base: 2800 },
    ],
  },
  {
    id: 'trained-maids',
    label: 'Trained Maids & Housekeeping',
    allowsDropOff: false,
    addOnIds: [],
    sizes: [
      { id: 'daily', label: 'Daily (per day)', base: 150 },
      { id: 'live-in', label: 'Live-in (monthly)', base: 2500 },
    ],
  },
  {
    id: 'pools',
    label: 'Swimming Pool Servicing & Cleaning',
    allowsDropOff: false,
    addOnIds: [],
    sizes: [
      { id: 'standard', label: 'Standard Pool Service', base: 800 },
      { id: 'large', label: 'Large Pool / Green Recovery', base: 1500 },
    ],
  },
];

/** Transport bands: Yango return trip from D13 Antelope Close, Kabulonga. */
export interface TransportZone {
  id: string;
  label: string;
  amount: number;
  areas: string[];
}

export const TRANSPORT_ZONES: TransportZone[] = [
  { id: 'zone-1', label: '0–5 km from Kabulonga', amount: 120, areas: ['Kabulonga', 'Sunningdale', 'Woodlands', 'Ibex Hill (near)'] },
  { id: 'zone-2', label: '5–10 km from Kabulonga', amount: 180, areas: ['Rhodes Park', 'Roma', 'Longacres', 'Olympia'] },
  { id: 'zone-3', label: '10–20 km from Kabulonga', amount: 250, areas: ['Ibex Hill', 'Meanwood', 'Avondale', 'Chalala', 'Chelstone'] },
  { id: 'zone-4', label: '20 km+ / outside Lusaka', amount: 350, areas: ['Chongwe', 'Airport Road', 'Ngwerere', 'Makeni Far'] },
];

export interface PricingInput {
  serviceId: string;
  sizeId: string;
  conditionId?: string;
  addOnIds?: string[];
  serviceMode: ServiceMode;
  /** Required when serviceMode is 'mobile'. */
  transportZoneId?: string;
}

export interface BreakdownLine {
  item: string;
  amount: number;
}

export interface PricingResult {
  basePrice: number;
  conditionMultiplier: number;
  conditionAdjustment: number;
  adjustedBase: number;
  addOnsTotal: number;
  transport: number;
  total: number;
  range: { min: number; max: number };
  breakdown: BreakdownLine[];
  confidence: 'high' | 'medium' | 'low';
  serviceLabel: string;
}

const round = (n: number) => Math.round(n);

export function getService(serviceId: string) {
  return SERVICES.find((s) => s.id === serviceId);
}

export function getTransportAmount(input: PricingInput): number {
  if (input.serviceMode === 'dropoff') return 0;
  const zone = TRANSPORT_ZONES.find((z) => z.id === input.transportZoneId);
  return zone ? zone.amount : 0;
}

/**
 * Estimate range rule (no random padding):
 *  - high confidence  (condition + zone/drop-off known): total → total + 10%
 *  - medium confidence (one input missing):              total → total + 20%
 *  - low confidence   (two or more missing):             total → total + 30%
 * The minimum is always the calculated starting total, since every price
 * on the site is a "starting from" figure.
 */
export function calculatePrice(input: PricingInput): PricingResult {
  const service = getService(input.serviceId);
  if (!service) throw new Error(`Unknown service: ${input.serviceId}`);
  const size = service.sizes.find((s) => s.id === input.sizeId);
  if (!size) throw new Error(`Unknown size: ${input.sizeId} for ${input.serviceId}`);

  const condition = CONDITIONS.find((c) => c.id === input.conditionId);
  const multiplier = condition ? condition.multiplier : 1.0;

  const basePrice = size.base;
  const adjustedBase = round(basePrice * multiplier);
  const conditionAdjustment = adjustedBase - basePrice;

  const selectedAddOns = (input.addOnIds || [])
    .map((id) => ADD_ONS.find((a) => a.id === id))
    .filter((a): a is AddOnDefinition => Boolean(a));
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.amount, 0);

  const transport = getTransportAmount(input);
  const total = adjustedBase + addOnsTotal + transport;

  const missing =
    (condition ? 0 : 1) +
    (input.serviceMode === 'mobile' && !input.transportZoneId ? 1 : 0);
  const confidence: PricingResult['confidence'] = missing === 0 ? 'high' : missing === 1 ? 'medium' : 'low';
  const uncertainty = confidence === 'high' ? 0.1 : confidence === 'medium' ? 0.2 : 0.3;

  const breakdown: BreakdownLine[] = [
    { item: `Base Service — ${service.label} (${size.label})`, amount: basePrice },
  ];
  if (conditionAdjustment !== 0 && condition) {
    breakdown.push({
      item: `Condition Adjustment — ${condition.label} (${condition.multiplier}× on base)`,
      amount: conditionAdjustment,
    });
  }
  selectedAddOns.forEach((a) => breakdown.push({ item: a.label, amount: a.amount }));
  breakdown.push({
    item: input.serviceMode === 'dropoff' ? 'Transport — Customer drop-off' : 'Transport — Yango return trip',
    amount: transport,
  });

  return {
    basePrice,
    conditionMultiplier: multiplier,
    conditionAdjustment,
    adjustedBase,
    addOnsTotal,
    transport,
    total,
    range: { min: total, max: round(total * (1 + uncertainty)) },
    breakdown,
    confidence,
    serviceLabel: `${service.label} — ${size.label}`,
  };
}

export const formatKwacha = (amount: number) => `K${amount.toLocaleString('en-ZM')}`;
