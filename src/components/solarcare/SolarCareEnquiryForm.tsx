import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Send, MessageCircle, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { solarPackages, installationTypes, serviceFrequencies, solarEnquirySchema, solarEnquirySource, validateSolarPhoto, SolarEnquiry } from '@/data/solarcare';
import { trackSolarCare } from '@/lib/solarcareAnalytics';

export default function SolarCareEnquiryForm({ preferredPackage, onPackageChange }: { preferredPackage: SolarEnquiry['package']; onPackageChange: (value: SolarEnquiry['package']) => void }) {
  const [form, setForm] = useState({ customerName: '', contactPerson: '', phone: '', email: '', location: '', installationType: 'Residential', panelCount: '', capacity: '', frequency: 'One-off cleaning', information: '', consent: false });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const [failure, setFailure] = useState('');
  const set = (field: keyof typeof form, value: string | boolean) => setForm(previous => ({ ...previous, [field]: value }));
  const input = (field: 'customerName' | 'contactPerson' | 'phone' | 'email' | 'location' | 'panelCount' | 'capacity', label: string, type = 'text', required = true, maxLength = 100) => (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={`solar-${field}`}>{label}</Label>
      <Input id={`solar-${field}`} name={field} type={type} value={form[field]} onChange={event => set(field, event.target.value)} required={required} maxLength={maxLength} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `solar-${field}-error` : undefined} />
      {errors[field] && <p id={`solar-${field}-error`} className="text-sm text-destructive">{errors[field]}</p>}
    </div>
  );
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setFailure('');
    const parsed = solarEnquirySchema.safeParse({ ...form, package: preferredPackage });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map(issue => [issue.path[0], issue.message])));
      return;
    }
    if (photo && !validateSolarPhoto(photo.size, photo.type)) { setFailure('Choose a JPG, PNG or WebP photo no larger than 5 MB.'); return; }
    setErrors({});
    setBusy(true);
    try {
      const body = new FormData();
      body.append('enquiry', JSON.stringify(parsed.data));
      if (photo) body.append('photo', photo);
      const { data, error } = await supabase.functions.invoke('solarcare-enquiry', { body });
      if (error) {
        if (error instanceof FunctionsHttpError) {
          const details = await error.context.json().catch(() => null);
          throw new Error(details?.error || 'Your enquiry could not be saved. Please try again.');
        }
        throw new Error('Unable to connect. Please try again or contact us on WhatsApp.');
      }
      if (!data?.success || !data.reference) throw new Error('Your enquiry could not be saved. Please try again.');
      setReference(data.reference);
      trackSolarCare('assessment_submitted', { package: preferredPackage, installation_type: parsed.data.installationType });
      const source = solarEnquirySource(parsed.data);
      if (source !== 'solarcare_residential') trackSolarCare(source.replace('solarcare_', '') + '_enquiry', { package: preferredPackage });
    } catch (error) { setFailure(error instanceof Error ? error.message : 'Please try again.'); }
    finally { setBusy(false); }
  };
  if (reference) return (
    <div role="status" className="py-10 space-y-5">
      <CheckCircle2 className="h-10 w-10 text-secondary" />
      <h3>SolarCare enquiry received</h3>
      <p className="text-muted-foreground">Your site details have been saved for our team to review. We’ll contact you to discuss access, scope and a site-specific quotation. No booking or payment has been confirmed.</p>
      <p className="text-sm text-muted-foreground break-all">Reference: {reference}</p>
      <Button asChild variant="outline"><a href={`https://wa.me/260768671420?text=${encodeURIComponent(`Hello WeWash SolarCare, I am following up on enquiry ${reference}.`)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackSolarCare('whatsapp_click', { context: 'enquiry_followup' })}><MessageCircle className="h-4 w-4 mr-2" />Follow up on WhatsApp</a></Button>
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">{input('customerName', 'Customer / company name')}{input('contactPerson', 'Contact person (optional)', 'text', false)}{input('phone', 'Telephone / WhatsApp', 'tel', true, 20)}{input('email', 'Email', 'email', true, 255)}</div>
      {input('location', 'Site location', 'text', true, 300)}
      <div className="space-y-2"><Label htmlFor="solar-installation">Installation type</Label><Select value={form.installationType} onValueChange={value => set('installationType', value)}><SelectTrigger id="solar-installation"><SelectValue /></SelectTrigger><SelectContent>{installationTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid sm:grid-cols-2 gap-5">{input('panelCount', 'Estimated panels (optional)', 'text', false, 16)}{input('capacity', 'Installed capacity in kWp (optional)', 'text', false, 16)}</div>
      <p className="text-sm text-muted-foreground">Not sure of your panel count or capacity? Leave these blank.</p>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2"><Label htmlFor="solar-package">Preferred package</Label><Select value={preferredPackage} onValueChange={value => { const selected = solarPackages.find(p => p.id === value); if (selected) onPackageChange(selected.id); }}><SelectTrigger id="solar-package"><SelectValue /></SelectTrigger><SelectContent>{solarPackages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label htmlFor="solar-frequency">One-off or recurring service</Label><Select value={form.frequency} onValueChange={value => set('frequency', value)}><SelectTrigger id="solar-frequency"><SelectValue /></SelectTrigger><SelectContent>{serviceFrequencies.map(frequency => <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="space-y-2"><Label htmlFor="solar-information">Additional information (optional)</Label><Textarea id="solar-information" value={form.information} onChange={event => set('information', event.target.value)} maxLength={1000} rows={4} placeholder="Access arrangements, water availability, contamination or partnership requirements" /></div>
      <div className="space-y-2"><Label htmlFor="solar-photo" className="flex items-center gap-2"><Upload className="h-4 w-4" />Site photo (optional)</Label><Input id="solar-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; setPhoto(file || null); setFailure(file && !validateSolarPhoto(file.size, file.type) ? 'Choose a JPG, PNG or WebP photo no larger than 5 MB.' : ''); }} /><p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to 5 MB. Your photo is private and used only to assess this enquiry.</p></div>
      <div className="flex gap-3 items-start"><Checkbox id="solar-consent" checked={form.consent} onCheckedChange={value => set('consent', value === true)} /><Label htmlFor="solar-consent" className="text-sm leading-relaxed font-normal">I agree that WeWash may contact me about this enquiry and use these details for assessment, as described in the <Link to="/privacy" className="underline text-secondary">Privacy Policy</Link>.</Label></div>
      {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
      <Button type="submit" className="btn-gold w-full sm:w-auto h-auto whitespace-normal text-left" disabled={busy}><Send className="h-4 w-4 mr-2 shrink-0" />{busy ? 'Sending enquiry…' : 'Request a Solar Site Assessment'}</Button>
      <p className="text-sm text-muted-foreground">Quotation after assessment. Final scope and service availability must be confirmed by our team. Payment is after service.</p>
    </form>
  );
}