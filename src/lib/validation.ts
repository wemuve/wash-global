import { z } from 'zod';

// Phone validation for Zambian numbers
// More flexible phone validation - accepts Zambian and international formats
const phoneRegex = /^[\d\s+()-]{9,20}$/;

export const phoneSchema = z.string()
  .min(9, 'Phone number is too short')
  .max(20, 'Phone number is too long')
  .regex(phoneRegex, 'Please enter a valid phone number');

export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .max(255, 'Email is too long')
  .optional()
  .or(z.literal(''));

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(/^[\p{L}\p{M}\s'.,-]+$/u, 'Name contains invalid characters');

export const addressSchema = z.string()
  .min(10, 'Please provide a more detailed address')
  .max(500, 'Address is too long');

export const messageSchema = z.string()
  .min(10, 'Message must be at least 10 characters')
  .max(1000, 'Message is too long');

// Booking form validation
export const bookingFormSchema = z.object({
  service_id: z.string().uuid('Please select a service'),
  package_id: z.string().uuid('Please select a package'),
  customer_name: nameSchema,
  customer_phone: phoneSchema,
  customer_email: emailSchema,
  customer_address: addressSchema,
  scheduled_date: z.string().min(1, 'Please select a date'),
  scheduled_time: z.string().min(1, 'Please select a time'),
  special_instructions: z.string().max(1000, 'Instructions too long').optional(),
  // Vehicle fields (optional, for car detailing)
  vehicle_make: z.string().max(50).optional(),
  vehicle_model: z.string().max(50).optional(),
  vehicle_year: z.string().optional(),
  vehicle_color: z.string().max(30).optional(),
  vehicle_type: z.string().max(30).optional(),
  license_plate: z.string().max(20).optional(),
  parking_details: z.string().max(200).optional(),
  vehicle_notes: z.string().max(500).optional(),
  water_available: z.boolean().optional(),
  electricity_available: z.boolean().optional(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: z.string().email('Please enter a valid email'),
  phone: phoneSchema,
  message: messageSchema,
});

// Lead capture validation
export const leadCaptureSchema = z.object({
  customer_name: nameSchema,
  customer_phone: phoneSchema,
  customer_email: emailSchema,
  message: z.string().max(1000).optional(),
  service_interest: z.array(z.string()).optional(),
  source: z.string().optional(),
});

// Vendor registration validation
export const vendorRegistrationSchema = z.object({
  name: nameSchema,
  email: z.string().email('Please enter a valid email'),
  phone: phoneSchema,
  experience: z.string().min(10, 'Please describe your experience').max(1000),
  specializations: z.array(z.string()).min(1, 'Select at least one specialization'),
  service_areas: z.array(z.string()).min(1, 'Select at least one service area'),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LeadCaptureData = z.infer<typeof leadCaptureSchema>;
export type VendorRegistrationData = z.infer<typeof vendorRegistrationSchema>;
