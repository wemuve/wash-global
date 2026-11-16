import { describe, expect, it } from 'bun:test';
import { solarEnquirySchema, solarEnquirySource, validateSolarPhoto, solarPackages } from '../src/data/solarcare';

const enquiry = { customerName: 'Solar Test Ltd', contactPerson: 'Test Contact', phone: '+260768671420', email: 'test@example.com', location: 'Kabulonga, Lusaka', installationType: 'Commercial', panelCount: '', capacity: '', package: 'business', frequency: 'One-off cleaning', information: '', consent: true };
describe('SolarCare enquiry rules', () => {
  it('allows submission without panel count or capacity', () => { expect(solarEnquirySchema.safeParse(enquiry).success).toBe(true); });
  it('rejects negative capacity and fractional panel counts', () => { expect(solarEnquirySchema.safeParse({ ...enquiry, capacity: '-1' }).success).toBe(false); expect(solarEnquirySchema.safeParse({ ...enquiry, panelCount: '2.5' }).success).toBe(false); });
  it('separates commercial follow-up', () => { expect(solarEnquirySource({ package: 'business', installationType: 'Commercial' })).toBe('solarcare_commercial'); });
  it('separates utility-scale follow-up even with a Home package', () => { expect(solarEnquirySource({ package: 'home', installationType: 'Solar farm' })).toBe('solarcare_utility_scale'); });
  it('separates partnership follow-up', () => { expect(solarEnquirySource({ package: 'partner', installationType: 'Commercial' })).toBe('solarcare_partnership'); });
  it('requires contact consent', () => { expect(solarEnquirySchema.safeParse({ ...enquiry, consent: false }).success).toBe(false); });
  it('allows an optional genuine image within the size limit, not other files', () => { expect(validateSolarPhoto(1024, 'image/jpeg')).toBe(true); expect(validateSolarPhoto(5 * 1024 * 1024 + 1, 'image/png')).toBe(false); expect(validateSolarPhoto(1024, 'application/pdf')).toBe(false); });
  it('provides exactly five quote-only packages', () => { expect(solarPackages.map(p => p.id)).toEqual(['home', 'business', 'industrial', 'farm', 'partner']); expect(solarPackages.some(p => 'price' in p)).toBe(false); });
});