import { z } from 'zod';

export const SOLAR_PRICING_KEY = 'solarcare_pricing_v1';
export const ASSESSMENT_MESSAGE = 'Thank you for your SolarCare enquiry. Your installation requires a site-specific assessment. Our team will review the installation details and prepare a quotation based on the site requirements.';
export const primaryMethods = ['panel', 'sqm', 'kwp', 'mwp'] as const;
const amount = z.number().finite().min(0).max(100000000).nullable();
const method = z.object({ active: z.boolean(), rate: amount });
export const chargeLabels = {
  mobilisation: 'Base mobilisation fee', labour: 'Labour per hour', equipment: 'Equipment charge',
  water: 'Water filtration / treatment', transport: 'Transport base charge', distance: 'Transport per return-trip km',
  access: 'Difficult access surcharge', contamination: 'Heavy contamination surcharge',
  bird: 'Bird dropping removal', vegetation: 'Vegetation management', debris: 'Debris removal',
  roof: 'Roof / access-area cleaning', monitoring: 'Qualified technician coordination',
} as const;
export const packagePricingSchema = z.object({
  status: z.enum(['pending', 'approved']), evidence: z.string().trim().max(1000),
  methods: z.object({ panel: method, sqm: method, kwp: method, mwp: method }),
  charges: z.object(Object.fromEntries(Object.keys(chargeLabels).map(key => [key, amount])) as Record<keyof typeof chargeLabels, typeof amount>),
  minimum: amount, recurringDiscount: z.number().min(0).max(100), commercialDiscount: z.number().min(0).max(100),
  savingsEvidence: z.string().trim().max(1000), taxPercent: z.number().min(0).max(100).nullable(),
  taxTreatment: z.enum(['pending', 'exclusive', 'inclusive', 'not-applicable']), validityDays: z.number().int().min(1).max(365).nullable(),
}).superRefine((value, context) => {
  if (value.status !== 'approved') return;
  if (!value.evidence) context.addIssue({ code: 'custom', message: 'Pilot cost approval evidence is required.', path: ['evidence'] });
  if (!Object.values(value.methods).some(m => m.active && m.rate !== null)) context.addIssue({ code: 'custom', message: 'Activate at least one validated pricing method.', path: ['methods'] });
  if (Object.values(value.methods).some(m => m.active && m.rate === null)) context.addIssue({ code: 'custom', message: 'Every active method needs an approved rate.', path: ['methods'] });
  if (Object.values(value.charges).some(v => v === null) || value.minimum === null || value.taxTreatment === 'pending' || value.taxPercent === null) context.addIssue({ code: 'custom', message: 'Validate all charges, minimum and tax treatment; use explicit zero where no charge applies.', path: ['charges'] });
  if (value.recurringDiscount > 0 && !value.savingsEvidence) context.addIssue({ code: 'custom', message: 'Recurring discounts need documented operational savings.', path: ['savingsEvidence'] });
});
export const solarPricingConfigSchema = z.object({ currency: z.literal('ZMW'), packages: z.object({ home: packagePricingSchema, business: packagePricingSchema, industrial: packagePricingSchema, farm: packagePricingSchema, partner: packagePricingSchema }) });
export type SolarPricingConfig = z.infer<typeof solarPricingConfigSchema>;
export function emptySolarPricing(): SolarPricingConfig {
  const one = () => ({ status: 'pending' as const, evidence: '', methods: { panel: { active: false, rate: null }, sqm: { active: false, rate: null }, kwp: { active: false, rate: null }, mwp: { active: false, rate: null } }, charges: Object.fromEntries(Object.keys(chargeLabels).map(key => [key, null])) as SolarPricingConfig['packages']['home']['charges'], minimum: null, recurringDiscount: 0, commercialDiscount: 0, savingsEvidence: '', taxPercent: null, taxTreatment: 'pending' as const, validityDays: null });
  return { currency: 'ZMW', packages: { home: one(), business: one(), industrial: one(), farm: one(), partner: one() } };
}
const measurement = z.string().trim().max(16).refine(v => v === '' || /^\d+(\.\d+)?$/.test(v) && Number(v) > 0 && Number.isFinite(Number(v)), 'Enter a positive measurement or leave blank.').default('');
export const solarScopeSchema = z.object({
  surfaceArea: measurement, capacityUnit: z.enum(['kWp', 'MWp']).default('kWp'),
  mounting: z.enum(['Unknown', 'Ground-mounted', 'Single-storey roof', 'Multi-storey roof', 'Other']).default('Unknown'),
  roofHeight: measurement, access: z.enum(['Unknown', 'Straightforward', 'Difficult', 'High-risk']).default('Unknown'),
  contamination: z.enum(['Unknown', 'Light', 'Moderate', 'Heavy']).default('Unknown'),
  waterAvailable: z.enum(['Unknown', 'Yes', 'No']).default('Unknown'),
  waterTreatment: z.enum(['Unknown', 'Required', 'Not required']).default('Unknown'),
  transportRequired: z.enum(['Unknown', 'Yes', 'No']).default('Unknown'),
  returnDistance: measurement, labourHours: measurement,
  equipment: z.string().trim().max(300).default(''),
  contractMonths: measurement,
  additionalServices: z.array(z.enum(['bird', 'vegetation', 'debris', 'roof', 'monitoring'])).max(5).default([]),
  primaryMethod: z.enum(primaryMethods).default('panel'),
});
export type SolarScope = z.infer<typeof solarScopeSchema>;
export type SolarEstimateInput = SolarScope & { package: keyof SolarPricingConfig['packages']; panelCount: string; capacity: string; installationType: string; frequency: string };
const money = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
export function calculateSolarEstimate(input: SolarEstimateInput, rawConfig: unknown) {
  const parsed = solarPricingConfigSchema.safeParse(rawConfig);
  const followUp: string[] = [];
  const exclusions = ['Electrical engineering, diagnostics and repairs', 'Guaranteed energy output or savings', 'Unagreed additional work'];
  const assessment = (reason: string) => ({ status: 'assessment' as const, message: ASSESSMENT_MESSAGE, reason, followUp, exclusions, total: null, currency: 'ZMW', breakdown: [] as { item: string; amount: number }[], validityDays: null as number | null });
  if (input.access === 'Unknown') followUp.push('What access arrangements and safe working height are available?');
  if (input.waterAvailable === 'Unknown' || input.waterTreatment === 'Unknown') followUp.push('Is suitable water available, and what treatment does the manufacturer require?');
  if (!input.panelCount && !input.surfaceArea && !input.capacity) followUp.push('Can you provide a panel count, surface area or installed capacity, or arrange a site assessment?');
  if (input.contamination === 'Unknown') followUp.push('How much dust, bird contamination or other debris is present?');
  if (!parsed.success || parsed.data.packages[input.package].status !== 'approved') return assessment('Pricing configuration is pending pilot-cost validation and administrator approval.');
  if (['industrial', 'farm', 'partner'].includes(input.package) || ['Industrial', 'Solar farm', 'Solar installation contractor'].includes(input.installationType) || input.access === 'High-risk' || input.mounting === 'Multi-storey roof') return assessment('A commercial or high-risk site requires physical assessment and a customised contract quotation.');
  const config = parsed.data.packages[input.package];
  const selected = config.methods[input.primaryMethod];
  if (!selected.active || selected.rate === null) return assessment('Selected pricing method is not active and approved.');
  const units = input.primaryMethod === 'panel' ? Number(input.panelCount) : input.primaryMethod === 'sqm' ? Number(input.surfaceArea) : input.primaryMethod === 'kwp' ? Number(input.capacity) * (input.capacityUnit === 'MWp' ? 1000 : 1) : Number(input.capacity) / (input.capacityUnit === 'kWp' ? 1000 : 1);
  if (!Number.isFinite(units) || units <= 0 || input.primaryMethod === 'panel' && !Number.isInteger(units)) { followUp.push(`What is the confirmed quantity for ${input.primaryMethod} pricing?`); return assessment('Required cleaning measurement is missing or invalid.'); }
  if (input.access === 'Unknown' || input.mounting === 'Unknown' || input.contamination === 'Unknown' || input.transportRequired === 'Unknown' || input.waterAvailable !== 'Yes' || input.waterTreatment === 'Unknown') return assessment('Site conditions need clarification before a monetary estimate.');
  if (input.equipment === '') { followUp.push('What cleaning and access equipment is required?'); return assessment('Equipment requirements must be reviewed.'); }
  if ((config.charges.labour || 0) > 0 && !input.labourHours) { followUp.push('How many labour hours are agreed for this scope?'); return assessment('Labour scope requires assessment.'); }
  if (input.transportRequired === 'Yes' && (config.charges.distance || 0) > 0 && !input.returnDistance) { followUp.push('What is the total return-trip distance?'); return assessment('Transport distance is not known.'); }
  const lines: { item: string; amount: number }[] = [];
  const add = (item: string, value: number) => lines.push({ item, amount: money(value) });
  add('Mobilisation', config.charges.mobilisation || 0);
  add(`Panel cleaning — ${units} ${input.primaryMethod}`, units * selected.rate);
  add('Labour', Number(input.labourHours || 0) * (config.charges.labour || 0));
  add('Equipment', config.charges.equipment || 0);
  add('Water treatment', input.waterTreatment === 'Required' ? config.charges.water || 0 : 0);
  add('Transport', input.transportRequired === 'Yes' ? (config.charges.transport || 0) + Number(input.returnDistance || 0) * (config.charges.distance || 0) : 0);
  add('Access surcharge', input.access === 'Difficult' ? config.charges.access || 0 : 0);
  add('Contamination surcharge', input.contamination === 'Heavy' ? config.charges.contamination || 0 : 0);
  [...new Set(input.additionalServices)].forEach(key => add(chargeLabels[key], config.charges[key] || 0));
  let subtotal = money(lines.reduce((s, line) => s + line.amount, 0));
  const commercial = input.package === 'business' || input.installationType === 'Commercial';
  const recurring = input.frequency !== 'One-off cleaning' && Number(input.contractMonths) > 0 && !!config.savingsEvidence;
  const percent = (commercial ? config.commercialDiscount : 0) + (recurring ? config.recurringDiscount : 0);
  const discount = money(subtotal * Math.min(percent, 100) / 100);
  if (discount) { add('Approved discounts', -discount); subtotal = money(subtotal - discount); }
  if (subtotal < (config.minimum || 0)) { add('Minimum project charge adjustment', (config.minimum || 0) - subtotal); subtotal = config.minimum || 0; }
  if (config.taxTreatment === 'exclusive') { const tax = money(subtotal * (config.taxPercent || 0) / 100); add('Tax', tax); subtotal = money(subtotal + tax); }
  return { status: 'indicative' as const, message: 'Indicative estimate — subject to site verification and final confirmation. Payment after service.', reason: '', followUp, exclusions, total: subtotal, currency: 'ZMW', breakdown: lines, validityDays: config.validityDays, taxTreatment: config.taxTreatment };
}