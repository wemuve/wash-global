import { z } from 'zod';
import { solarScopeSchema } from './solarcare-pricing';

export const SOLARCARE_PATH = '/solar-panel-cleaning-lusaka';
export const solarPackages = [
  { id: 'home', name: 'SolarCare Home', audience: 'Residential solar installations', features: ['Panel surface cleaning', 'Dust and visible contamination removal', 'Visual condition checks', 'Before-and-after photographs', 'Service completion report', 'Optional recurring cleaning'] },
  { id: 'business', name: 'SolarCare Business', audience: 'Offices, hotels, shopping centres, schools and commercial buildings', features: ['Professional panel cleaning', 'Surface contamination assessment', 'Visual damage and obstruction reporting', 'Before-and-after photographs', 'Digital service report', 'Scheduled service agreements'] },
  { id: 'industrial', name: 'SolarCare Industrial', audience: 'Manufacturing facilities, mines, agricultural operations and industrial properties', features: ['Initial site assessment', 'Site-specific cleaning programme', 'Large-area cleaning coordination', 'Safety planning', 'Visual condition reporting', 'Recurring maintenance schedules'] },
  { id: 'farm', name: 'SolarCare Farm', audience: 'Utility-scale solar farms, independent power producers and solar project operators', features: ['Initial site survey', 'Cleaning programme planning', 'Panel-block cleaning coordination', 'Quality verification', 'Documented cleaning reports', 'Scheduled cleaning contracts', 'Coordination with site operations personnel'] },
  { id: 'partner', name: 'SolarCare Partner', audience: 'Solar installers, EPC contractors, developers and equipment suppliers', features: ['Outsourced solar panel cleaning', 'Post-installation cleaning', 'Handover preparation support', 'Subcontracted service delivery', 'Recurring client maintenance arrangements', 'Site documentation', 'Partnership agreements'] },
] as const;
export const installationTypes = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Solar farm', 'Solar installation contractor', 'Other'] as const;
export const serviceFrequencies = ['One-off cleaning', 'Monthly agreement', 'Quarterly agreement', 'Custom schedule', 'Annual service agreement'] as const;

const optionalNumber = (integer: boolean) => z.string().trim().max(16).refine(value => value === '' || (Number.isFinite(Number(value)) && Number(value) > 0 && (!integer || Number.isInteger(Number(value)))), integer ? 'Enter a positive whole panel count, or leave it blank.' : 'Enter a positive capacity, or leave it blank.');
export const solarEnquirySchema = z.object({
  customerName: z.string().trim().min(2, 'Enter your name or company name.').max(100),
  contactPerson: z.string().trim().max(100),
  phone: z.string().trim().min(9).max(20).regex(/^[+\d\s()-]+$/, 'Enter a valid telephone number.'),
  email: z.string().trim().email('Enter a valid email address.').max(255),
  location: z.string().trim().min(3, 'Enter the site location.').max(300),
  installationType: z.enum(installationTypes),
  panelCount: optionalNumber(true),
  capacity: optionalNumber(false),
  package: z.enum(['home', 'business', 'industrial', 'farm', 'partner']),
  frequency: z.enum(serviceFrequencies),
  information: z.string().trim().max(1000),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please agree to be contacted about this enquiry.' }) }),
  scope: solarScopeSchema.optional(),
});
export type SolarEnquiry = z.infer<typeof solarEnquirySchema>;
export function solarEnquirySource(enquiry: Pick<SolarEnquiry, 'package' | 'installationType'>) {
  if (enquiry.package === 'farm' || enquiry.installationType === 'Solar farm') return 'solarcare_utility_scale';
  if (enquiry.package === 'partner' || enquiry.installationType === 'Solar installation contractor') return 'solarcare_partnership';
  if (['business', 'industrial'].includes(enquiry.package) || ['Commercial', 'Industrial', 'Agricultural'].includes(enquiry.installationType)) return 'solarcare_commercial';
  return 'solarcare_residential';
}
export function solarEnquirySummary(enquiry: SolarEnquiry) {
  return [`${solarPackages.find(p => p.id === enquiry.package)?.name} — ${enquiry.installationType}`, `Contact: ${enquiry.contactPerson || enquiry.customerName}`, `Site: ${enquiry.location}`, `Panels: ${enquiry.panelCount || 'Not known'}`, `Capacity: ${enquiry.capacity ? `${enquiry.capacity} ${enquiry.scope?.capacityUnit || 'kWp'}` : 'Not known'}`, `Schedule: ${enquiry.frequency}`, enquiry.scope ? `Installation scope: ${JSON.stringify(enquiry.scope)}` : '', enquiry.information].filter(Boolean).join('\n');
}
export const MAX_SOLAR_PHOTO_BYTES = 5 * 1024 * 1024;
export function validateSolarPhoto(size: number, type: string) {
  return size > 0 && size <= MAX_SOLAR_PHOTO_BYTES && ['image/jpeg', 'image/png', 'image/webp'].includes(type);
}