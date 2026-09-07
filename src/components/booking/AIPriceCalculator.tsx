import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageCircle,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Truck,
  Shield,
  ClipboardCheck,
} from 'lucide-react';
import {
  SERVICES,
  CONDITIONS,
  ADD_ONS,
  TRANSPORT_ZONES,
  calculatePrice,
  formatKwacha,
  type ServiceMode,
  type PricingResult,
} from '@/lib/pricing';

export interface EstimateResult extends PricingResult {
  estimatedPrice: number;
  priceRange: { min: number; max: number };
  serviceType: string;
}

interface AIPriceCalculatorProps {
  onPriceCalculated?: (price: number, result: EstimateResult) => void;
  onBookNow?: (result: EstimateResult) => void;
}

const AIPriceCalculator: React.FC<AIPriceCalculatorProps> = ({ onPriceCalculated, onBookNow }) => {
  const [serviceId, setServiceId] = useState('car-full');
  const [sizeId, setSizeId] = useState('small');
  const [conditionId, setConditionId] = useState('');
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [serviceMode, setServiceMode] = useState<ServiceMode>('mobile');
  const [transportZoneId, setTransportZoneId] = useState('');
  const [notes, setNotes] = useState('');

  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId)!, [serviceId]);

  const handleServiceChange = (value: string) => {
    const next = SERVICES.find((s) => s.id === value)!;
    setServiceId(value);
    setSizeId(next.sizes[0].id);
    setAddOnIds([]);
    if (!next.allowsDropOff) setServiceMode('mobile');
  };

  const toggleAddOn = (id: string) =>
    setAddOnIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const result = useMemo(() => {
    try {
      return calculatePrice({ serviceId, sizeId, conditionId: conditionId || undefined, addOnIds, serviceMode, transportZoneId: transportZoneId || undefined });
    } catch {
      return null;
    }
  }, [serviceId, sizeId, conditionId, addOnIds, serviceMode, transportZoneId]);

  const estimate: EstimateResult | null = result
    ? { ...result, estimatedPrice: result.total, priceRange: result.range, serviceType: result.serviceLabel }
    : null;

  React.useEffect(() => {
    if (estimate) onPriceCalculated?.(estimate.total, estimate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimate?.total]);

  const whatsappMessage = (intro: string) => {
    if (!estimate) return '';
    const lines = [
      intro,
      '',
      `Service: ${estimate.serviceLabel}`,
      `Condition: ${CONDITIONS.find((c) => c.id === conditionId)?.label || 'Not specified'}`,
      `Service mode: ${serviceMode === 'dropoff' ? 'Customer drop-off at Kabulonga' : 'Mobile service'}`,
      serviceMode === 'mobile'
        ? `Area: ${TRANSPORT_ZONES.find((z) => z.id === transportZoneId)?.label || 'Not specified'}`
        : '',
      '',
      'Breakdown:',
      ...estimate.breakdown.map((b) => `• ${b.item}: ${formatKwacha(b.amount)}`),
      `Starting total: ${formatKwacha(estimate.total)}`,
      notes ? `\nNotes: ${notes}` : '',
      '',
      'Please confirm the final price after assessment.',
    ].filter(Boolean);
    return encodeURIComponent(lines.join('\n'));
  };

  const openWhatsApp = (intro: string) =>
    window.open(`https://wa.me/260768671420?text=${whatsappMessage(intro)}`, '_blank');

  return (
    <Card className="border border-border shadow-elegant overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-secondary" />
          Price Estimator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Starting From — Estimate Only</span> — Final quote after confirmation by our team.
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        {/* Service */}
        <div>
          <Label className="mb-2 block font-medium">Service *</Label>
          <Select value={serviceId} onValueChange={handleServiceChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size */}
        <div>
          <Label className="mb-2 block font-medium">Size / Package *</Label>
          <Select value={sizeId} onValueChange={setSizeId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {service.sizes.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label} — from {formatKwacha(s.base)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div>
          <Label className="mb-2 block font-medium">Condition</Label>
          <Select value={conditionId} onValueChange={setConditionId}>
            <SelectTrigger><SelectValue placeholder="Select condition level" /></SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.label} ({c.multiplier}×)</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            The condition multiplier applies to the base service only — never to add-ons or transport.
          </p>
        </div>

        {/* Add-ons */}
        {service.addOnIds.length > 0 && (
          <div>
            <Label className="mb-2 block font-medium">Optional Add-ons</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {service.addOnIds.map((id) => {
                const addOn = ADD_ONS.find((a) => a.id === id)!;
                const selected = addOnIds.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleAddOn(id)}
                    className={`text-left p-3 rounded-xl border transition-colors ${
                      selected ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <span className="block text-sm font-medium text-foreground">{addOn.label}</span>
                    <span className="text-xs text-muted-foreground">+{formatKwacha(addOn.amount)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Service mode */}
        <div>
          <Label className="mb-2 block font-medium">Service Mode *</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setServiceMode('mobile')}
              className={`p-3 rounded-xl border text-left transition-colors ${
                serviceMode === 'mobile' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="block text-sm font-medium text-foreground">Mobile Service</span>
              <span className="text-xs text-muted-foreground">We come to you — transport added</span>
            </button>
            <button
              type="button"
              disabled={!service.allowsDropOff}
              onClick={() => setServiceMode('dropoff')}
              className={`p-3 rounded-xl border text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                serviceMode === 'dropoff' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="block text-sm font-medium text-foreground">Customer Drop-Off</span>
              <span className="text-xs text-muted-foreground">Kabulonga base — transport K0</span>
            </button>
          </div>
        </div>

        {/* Transport zone */}
        {serviceMode === 'mobile' && (
          <div>
            <Label className="flex items-center gap-2 mb-2 font-medium">
              <MapPin className="h-4 w-4 text-primary" /> Your Area
            </Label>
            <Select value={transportZoneId} onValueChange={setTransportZoneId}>
              <SelectTrigger><SelectValue placeholder="Select your distance band" /></SelectTrigger>
              <SelectContent>
                {TRANSPORT_ZONES.map((z) => (
                  <SelectItem key={z.id} value={z.id}>
                    {z.label} — {formatKwacha(z.amount)} ({z.areas.slice(0, 3).join(', ')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Truck className="h-3 w-3" /> Return trip estimated from D13 Antelope Close, Kabulonga
            </p>
          </div>
        )}

        {/* Notes */}
        <div>
          <Label className="mb-2 block font-medium">Anything else we should know?</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Access details, number of rooms, stains, pets, preferred day…"
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Result */}
        {estimate && (
          <div className="space-y-4 animate-fade-up">
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Starting From — Estimate Only — Final Quote After Confirmation
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/70 mb-1">Starting Estimate</p>
              <p className="text-4xl font-bold text-primary-foreground">From {formatKwacha(estimate.total)}</p>
              {estimate.range.max > estimate.range.min && (
                <p className="text-sm text-primary-foreground/80 mt-1">
                  Likely range: {formatKwacha(estimate.range.min)} – {formatKwacha(estimate.range.max)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center">
              <span className="px-3 py-1 rounded-full text-sm font-medium border border-border text-muted-foreground">
                {estimate.confidence === 'high' && <CheckCircle2 className="h-4 w-4 inline mr-1 text-success" />}
                {estimate.confidence.charAt(0).toUpperCase() + estimate.confidence.slice(1)} confidence
              </span>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
              <p className="font-semibold text-sm mb-3 text-foreground">Price Breakdown</p>
              <div className="space-y-2">
                {estimate.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{item.item}</span>
                    <span className="font-medium text-foreground whitespace-nowrap">
                      {idx === 0 ? formatKwacha(item.amount) : item.amount === 0 ? 'K0' : `+${formatKwacha(item.amount)}`}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm font-bold">
                  <span className="text-foreground">Starting Total</span>
                  <span className="text-primary">{formatKwacha(estimate.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="flex gap-2 items-start">
                <Shield className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is a starting estimate, not a binding quotation. The final price is confirmed after our
                  team reviews scope, condition, access, labour and materials. Nothing is charged until the work is done.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => openWhatsApp('Hello WeWash! Please confirm this estimate:')} className="w-full btn-gold gap-2" size="lg">
                <ClipboardCheck className="h-5 w-5" />
                Request Final Confirmation
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => openWhatsApp('Hello WeWash! I have a question about this estimate:')} variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" /> Ask Questions
                </Button>
                <Button onClick={() => onBookNow?.(estimate)} variant="outline" className="gap-2">
                  Book Now <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPriceCalculator;
