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
import { solarScopeSchema, chargeLabels, calculateSolarEstimate, emptySolarPricing } from '@/lib/solarcarePricing';

export default function SolarCareEnquiryForm({ preferredPackage, onPackageChange, estimatorMode = false }: { preferredPackage: SolarEnquiry['package']; onPackageChange: (value: SolarEnquiry['package']) => void; estimatorMode?: boolean }) {
  const [form, setForm] = useState({ customerName: '', contactPerson: '', phone: '', email: '', location: '', installationType: 'Residential', panelCount: '', capacity: '', frequency: 'One-off cleaning', information: '', consent: false });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const [failure, setFailure] = useState('');
  const [scope, setScope] = useState(() => solarScopeSchema.parse({}));
  const [estimate, setEstimate] = useState<ReturnType<typeof calculateSolarEstimate> | null>(null);
  const changeScope = (key: keyof typeof scope, value: unknown) => { setEstimate(null); setScope(previous => solarScopeSchema.parse({ ...previous, [key]: value })); };
  const scopeSelect = (key: keyof typeof scope, label: string, options: string[]) => <div className="space-y-2 min-w-0"><Label>{label}</Label><Select value={String(scope[key])} onValueChange={value => changeScope(key, value)}><SelectTrigger aria-label={label}><SelectValue /></SelectTrigger><SelectContent>{options.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>;
  const scopeInput = (key: 'surfaceArea' | 'roofHeight' | 'returnDistance' | 'labourHours' | 'contractMonths' | 'equipment', label: string) => <div className="space-y-2"><Label>{label}</Label><Input aria-label={label} value={scope[key]} maxLength={key === 'equipment' ? 300 : 16} onChange={e => { setEstimate(null); setScope(previous => ({ ...previous, [key]: e.target.value })); }} /></div>;
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
    const parsed = solarEnquirySchema.safeParse({ ...form, package: preferredPackage, ...(estimatorMode ? { scope } : {}) });
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
  const getEstimate = async () => {
    const parsed = solarEnquirySchema.safeParse({ ...form, package: preferredPackage, scope });
    if (!parsed.success) { setErrors(Object.fromEntries(parsed.error.issues.map(i => [i.path[0], i.message]))); setFailure('Please complete the contact details, agree to contact and check optional measurements.'); return; }
    setBusy(true); setFailure(''); setErrors({});
    try {
      const { data, error } = await supabase.functions.invoke('solarcare-pricing', { body: { action: 'estimate', enquiry: parsed.data, scope } });
      if (error || !data?.status) throw new Error('Unable to check approved pricing. Your details are preserved; please retry or request an assessment.');
      setEstimate(data);
    } catch (e) { setFailure(e instanceof Error ? e.message : 'Unable to check pricing.'); }
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
      {estimatorMode && <fieldset className="space-y-5 border-t border-border pt-5"><legend className="font-medium pt-5">Installation and quotation scope</legend><div className="grid sm:grid-cols-2 gap-5">
        {scopeInput('surfaceArea', 'Total panel surface area in m² (optional)')}
        {scopeSelect('capacityUnit', 'Installed capacity unit', ['kWp', 'MWp'])}
        {scopeSelect('primaryMethod', 'Preferred primary pricing method', ['panel', 'sqm', 'kwp', 'mwp'])}
        {scopeSelect('mounting', 'Roof / mounting arrangement', ['Unknown', 'Ground-mounted', 'Single-storey roof', 'Multi-storey roof', 'Other'])}
        {scopeInput('roofHeight', 'Roof height in metres (optional)')}
        {scopeSelect('access', 'Access difficulty', ['Unknown', 'Straightforward', 'Difficult', 'High-risk'])}
        {scopeSelect('contamination', 'Contamination level', ['Unknown', 'Light', 'Moderate', 'Heavy'])}
        {scopeSelect('waterAvailable', 'Water available', ['Unknown', 'Yes', 'No'])}
        {scopeSelect('waterTreatment', 'Water treatment requirements', ['Unknown', 'Required', 'Not required'])}
        {scopeSelect('transportRequired', 'Transport required', ['Unknown', 'Yes', 'No'])}
        {scopeInput('returnDistance', 'Total return-trip distance in km (optional)')}
        {scopeInput('labourHours', 'Assessed labour hours (optional)')}
        {scopeInput('equipment', 'Required equipment / access arrangements')}
        {scopeInput('contractMonths', 'Contract duration in months (optional)')}
      </div><div className="space-y-3"><Label>Additional site-care services</Label>{(['bird', 'vegetation', 'debris', 'roof', 'monitoring'] as const).map(key => <Label key={key} className="flex items-center gap-3 font-normal"><Checkbox checked={scope.additionalServices.includes(key)} onCheckedChange={checked => changeScope('additionalServices', checked ? [...scope.additionalServices, key] : scope.additionalServices.filter(v => v !== key))} />{chargeLabels[key]}</Label>)}</div></fieldset>}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2"><Label htmlFor="solar-package">Preferred package</Label><Select value={preferredPackage} onValueChange={value => { const selected = solarPackages.find(p => p.id === value); if (selected) onPackageChange(selected.id); }}><SelectTrigger id="solar-package"><SelectValue /></SelectTrigger><SelectContent>{solarPackages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label htmlFor="solar-frequency">One-off or recurring service</Label><Select value={form.frequency} onValueChange={value => set('frequency', value)}><SelectTrigger id="solar-frequency"><SelectValue /></SelectTrigger><SelectContent>{serviceFrequencies.map(frequency => <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="space-y-2"><Label htmlFor="solar-information">Additional information (optional)</Label><Textarea id="solar-information" value={form.information} onChange={event => set('information', event.target.value)} maxLength={1000} rows={4} placeholder="Access arrangements, water availability, contamination or partnership requirements" /></div>
      <div className="space-y-2"><Label htmlFor="solar-photo" className="flex items-center gap-2"><Upload className="h-4 w-4" />Site photo (optional)</Label><Input id="solar-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; setPhoto(file || null); setFailure(file && !validateSolarPhoto(file.size, file.type) ? 'Choose a JPG, PNG or WebP photo no larger than 5 MB.' : ''); }} /><p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to 5 MB. Your photo is private and used only to assess this enquiry.</p></div>
      <div className="flex gap-3 items-start"><Checkbox id="solar-consent" checked={form.consent} onCheckedChange={value => set('consent', value === true)} /><Label htmlFor="solar-consent" className="text-sm leading-relaxed font-normal">I agree that WeWash may contact me about this enquiry and use these details for assessment, as described in the <Link to="/privacy" className="underline text-secondary">Privacy Policy</Link>.</Label></div>
      {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
      {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
      {estimatorMode && <Button type="button" variant="outline" className="w-full h-auto whitespace-normal" disabled={busy} onClick={getEstimate}>{busy ? 'Checking approved pricing…' : 'Check SolarCare estimate'}</Button>}
      {estimatorMode && estimate && <div role="status" className="border-t border-border py-5 space-y-4">
        <h3 className="text-xl tracking-normal">{estimate.status === 'indicative' ? `Indicative estimate: ZMW ${estimate.total?.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}` : 'Site-specific assessment required'}</h3><p className="text-sm text-muted-foreground">{estimate.message}</p>
        <p className="text-sm">Package: {solarPackages.find(p => p.id === preferredPackage)?.name} · {form.installationType} · {form.location}</p>
        <p className="text-sm text-muted-foreground">Scope: {form.panelCount || 'Unknown'} panels; {scope.surfaceArea || 'unknown'} m²; {form.capacity || 'unknown'} {scope.capacityUnit}. Labour: {scope.labourHours || 'to assess'} hours. Equipment: {scope.equipment || 'to assess'}. Schedule: {form.frequency}.</p>
        {estimate.breakdown.map(line => <div key={line.item} className="flex justify-between gap-3 text-sm"><span>{line.item}</span><span className="whitespace-nowrap">ZMW {line.amount.toFixed(2)}</span></div>)}
        {estimate.reason && <p className="text-sm text-muted-foreground">{estimate.reason}</p>}
        {estimate.followUp.length > 0 && <div><p className="font-medium text-sm">Details to clarify</p><ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 mt-2">{estimate.followUp.map(q => <li key={q}>{q}</li>)}</ul></div>}
        <p className="text-xs text-muted-foreground">Excluded: {estimate.exclusions.join('; ')}.</p>{estimate.validityDays && <p className="text-sm">Indicative quotation validity: {estimate.validityDays} days, subject to site verification.</p>}
      </div>}
      <Button type="submit" className="btn-gold w-full sm:w-auto h-auto whitespace-normal text-left" disabled={busy}><Send className="h-4 w-4 mr-2 shrink-0" />{busy ? 'Sending enquiry…' : 'Request a Solar Site Assessment'}</Button>
      <p className="text-sm text-muted-foreground">Quotation after assessment. Final scope and service availability must be confirmed by our team. Payment is after service.</p>
    </form>
  );
}