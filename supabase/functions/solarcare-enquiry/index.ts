import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { solarEnquirySchema, solarEnquirySource, solarEnquirySummary, validateSolarPhoto } from '../_shared/solarcare.ts';

const respond = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return respond({ error: 'Enquiry service unavailable' }, 503);
  const db = createClient(url, key);
  try {
    // Staff can read an attachment only after a real session and protected role check.
    if (req.headers.get('content-type')?.includes('application/json')) {
      const body = await req.json();
      if (body.action !== 'photo' || typeof body.leadId !== 'string' || !/^[\da-f-]{36}$/i.test(body.leadId)) return respond({ error: 'Invalid request' }, 400);
      const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
      if (!token) return respond({ error: 'Sign in required' }, 401);
      const { data: { user }, error: authError } = await db.auth.getUser(token);
      if (authError || !user) return respond({ error: 'Sign in required' }, 401);
      const { data: roles } = await db.from('user_roles').select('role').eq('user_id', user.id).in('role', ['admin', 'manager']);
      if (!roles?.length) return respond({ error: 'Staff access required' }, 403);
      const { data: lead } = await db.from('leads').select('notes').eq('id', body.leadId).single();
      const path = lead?.notes?.solarcare?.photoPath;
      if (typeof path !== 'string' || !path.startsWith(`${body.leadId}/`)) return respond({ error: 'Photo not found' }, 404);
      const { data, error } = await db.storage.from('solarcare-enquiries').createSignedUrl(path, 300);
      if (error) return respond({ error: 'Photo unavailable' }, 500);
      return respond({ url: data.signedUrl });
    }
    // This endpoint intentionally accepts guests; credentials are used only for validated inserts.
    if (Number(req.headers.get('content-length') || 0) > 6 * 1024 * 1024) return respond({ error: 'Upload too large' }, 413);
    const form = await req.formData();
    const parsed = solarEnquirySchema.safeParse(JSON.parse(String(form.get('enquiry') || '{}')));
    if (!parsed.success) return respond({ error: 'Please check the enquiry fields.', fields: parsed.error.flatten().fieldErrors }, 400);
    const photo = form.get('photo');
    if (photo && (!(photo instanceof File) || !validateSolarPhoto(photo.size, photo.type))) return respond({ error: 'Photo must be a JPG, PNG or WebP up to 5 MB.' }, 400);
    const enquiry = parsed.data;
    const id = crypto.randomUUID();
    let photoPath: string | null = null;
    if (photo instanceof File) {
      const bytes = new Uint8Array(await photo.arrayBuffer());
      const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      const png = bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
      const webp = new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
      if (!(photo.type === 'image/jpeg' && jpeg || photo.type === 'image/png' && png || photo.type === 'image/webp' && webp)) return respond({ error: 'The photo format could not be verified.' }, 400);
      const ext = photo.type === 'image/jpeg' ? 'jpg' : photo.type === 'image/png' ? 'png' : 'webp';
      photoPath = `${id}/site-photo.${ext}`;
      const { error } = await db.storage.from('solarcare-enquiries').upload(photoPath, bytes, { contentType: photo.type });
      if (error) return respond({ error: 'Photo could not be saved. Please retry without the photo or contact us on WhatsApp.' }, 500);
    }
    const { error } = await db.from('leads').insert({
      id, customer_name: enquiry.customerName, customer_phone: enquiry.phone, customer_email: enquiry.email,
      company_name: enquiry.installationType === 'Residential' ? null : enquiry.customerName,
      status: 'new', source: solarEnquirySource(enquiry), service_interest: ['WeWash SolarCare', enquiry.package],
      message: solarEnquirySummary(enquiry),
      notes: { solarcare: { ...enquiry, photoPath, submittedAt: new Date().toISOString() } },
    });
    if (error) {
      if (photoPath) await db.storage.from('solarcare-enquiries').remove([photoPath]);
      return respond({ error: 'Your enquiry could not be saved. Please try again or contact us on WhatsApp.' }, 500);
    }
    return respond({ success: true, reference: id });
  } catch {
    return respond({ error: 'Invalid enquiry. Please check your details and try again.' }, 400);
  }
});