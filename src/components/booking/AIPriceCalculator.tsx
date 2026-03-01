import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Loader2, 
  MessageCircle, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Truck,
  Shield,
  ClipboardCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PriceBreakdown {
  item: string;
  amount: number;
}

interface PriceResult {
  estimatedPrice: number;
  priceRange: { min: number; max: number };
  breakdown: PriceBreakdown[];
  serviceType: string;
  confidence: 'high' | 'medium' | 'low';
  conditionMultiplier?: number;
  transportEstimate?: number;
  notes: string;
  needsQuote: boolean;
}

interface AIPriceCalculatorProps {
  onPriceCalculated?: (price: number, result: PriceResult) => void;
  onBookNow?: (result: PriceResult) => void;
}

const serviceTypes = [
  { value: 'general-cleaning', label: 'General Cleaning (Interior)' },
  { value: 'deep-cleaning', label: 'Deep Cleaning' },
  { value: 'post-construction', label: 'Post-Construction Cleaning' },
  { value: 'car-interior', label: 'Car Detailing – Interior Deep Clean' },
  { value: 'car-full', label: 'Car Detailing – Full (Interior + Exterior)' },
  { value: 'fumigation', label: 'Fumigation & Pest Control' },
  { value: 'office-cleaning', label: 'Office Cleaning' },
  { value: 'facility-management', label: 'Facility Management' },
  { value: 'trained-maids', label: 'Trained Maids & Housekeeping' },
  { value: 'other', label: 'Other / Multiple Services' },
];

const conditionOptions = [
  { value: 'light', label: 'Light / Well-maintained', multiplier: '1.0x' },
  { value: 'moderate', label: 'Moderate dirt', multiplier: '1.2x' },
  { value: 'heavy', label: 'Heavy dirt / Neglected', multiplier: '1.4x' },
  { value: 'post-construction', label: 'Post-construction debris', multiplier: '1.6x' },
];

const AIPriceCalculator: React.FC<AIPriceCalculatorProps> = ({ onPriceCalculated, onBookNow }) => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState('');

  const calculatePrice = async () => {
    if (!jobDescription.trim()) {
      setError('Please describe your requirements');
      return;
    }

    setIsCalculating(true);
    setError('');
    setResult(null);

    const conditionLabel = conditionOptions.find(c => c.value === condition)?.label || 'Not specified';

    try {
      const { data, error: fnError } = await supabase.functions.invoke('calculate-price', {
        body: {
          jobDescription: `${jobDescription.trim()}\n\nCondition: ${conditionLabel}`,
          location: location.trim() || 'Lusaka (distance unknown)',
          serviceType: serviceTypes.find(s => s.value === serviceType)?.label || serviceType,
        },
      });

      if (fnError) throw fnError;

      setResult(data);
      onPriceCalculated?.(data.estimatedPrice, data);
    } catch (err: any) {
      console.error('Price estimation error:', err);
      setError('Failed to generate estimate. Please try again or contact us directly.');
    } finally {
      setIsCalculating(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello WeWash! I need a professional quote for:\n\nService: ${serviceTypes.find(s => s.value === serviceType)?.label || 'Cleaning Service'}\nLocation: ${location || 'Lusaka'}\nCondition: ${conditionOptions.find(c => c.value === condition)?.label || 'Not specified'}\n\nDetails:\n${jobDescription}\n\nAI Estimate: From K${result?.estimatedPrice?.toLocaleString() || 'N/A'}\n\nPlease confirm final pricing after assessment.`
    );
    window.open(`https://wa.me/260768671420?text=${message}`, '_blank');
  };

  const requestConfirmation = () => {
    const message = encodeURIComponent(
      `Hello WeWash! I'd like to request final confirmation on this estimate:\n\nService: ${serviceTypes.find(s => s.value === serviceType)?.label || 'Cleaning Service'}\nLocation: ${location || 'Lusaka'}\nCondition: ${conditionOptions.find(c => c.value === condition)?.label || 'Not specified'}\n\nDetails:\n${jobDescription}\n\nAI Starting Estimate: From K${result?.estimatedPrice?.toLocaleString() || 'N/A'}\nEstimated Range: K${result?.priceRange?.min?.toLocaleString()} – K${result?.priceRange?.max?.toLocaleString()}\n\nPlease schedule an assessment and confirm the final price.`
    );
    window.open(`https://wa.me/260768671420?text=${message}`, '_blank');
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    }
  };

  return (
    <Card className="border border-border shadow-elegant overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-secondary" />
          AI Price Estimator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Starting From (Estimate Only)</span> — 
          Final quote confirmed after professional assessment by our sales manager.
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Service Type */}
        <div>
          <Label className="mb-2 block font-medium">Service Type *</Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <Label className="flex items-center gap-2 mb-2 font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            Location / Area
          </Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Kabulonga, Meanwood, Roma, Avondale, Chalalala"
          />
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Transport calculated from our base in Kabulonga (Yango return trip)
          </p>
        </div>

        {/* Condition */}
        <div>
          <Label className="mb-2 block font-medium">Property / Vehicle Condition</Label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition level" />
            </SelectTrigger>
            <SelectContent>
              {conditionOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} ({opt.multiplier})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Description */}
        <div>
          <Label className="mb-2 block font-medium">Describe Your Requirements *</Label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Be as specific as possible:
• Number of bedrooms / rooms
• Number and type of windows (standard/large aluminum)
• Current condition of the space
• For cars: vehicle type (sedan, SUV), interior/exterior needs
• Any special requirements (seat removal, carpets, etc.)
• Frequency (one-time or recurring)"
            rows={5}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            More detail = more accurate starting estimate
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Calculate Button */}
        <Button 
          onClick={calculatePrice} 
          disabled={isCalculating || !jobDescription.trim()}
          className="w-full btn-gold gap-2"
          size="lg"
        >
          {isCalculating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Estimate...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Get Starting Estimate
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4 animate-fade-up">
            {/* Starting Estimate Header */}
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Starting From (Estimate Only – Final Quote After Confirmation)
              </p>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-center">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/70 mb-1">Starting Estimate</p>
              <p className="text-4xl font-bold text-primary-foreground">From K{result.estimatedPrice.toLocaleString()}</p>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Estimated range: K{result.priceRange.min.toLocaleString()} – K{result.priceRange.max.toLocaleString()}
              </p>
            </div>

            {/* Confidence Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceColor(result.confidence)}`}>
                {result.confidence === 'high' && <CheckCircle2 className="h-4 w-4 inline mr-1" />}
                {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} Confidence
              </span>
            </div>

            {/* Breakdown */}
            {result.breakdown && result.breakdown.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-semibold text-sm mb-3 text-foreground">Price Breakdown</p>
                <div className="space-y-2">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.item}</span>
                      <span className="font-medium text-foreground">K{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm font-bold">
                    <span className="text-foreground">Starting Total</span>
                    <span className="text-primary">From K{result.estimatedPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {result.notes && (
              <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/30">
                💡 {result.notes}
              </p>
            )}

            {/* Mandatory Disclaimer */}
            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="flex gap-2 items-start">
                <Shield className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Important: This is an Automated Estimate</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This is an automated estimate based on provided details. Final pricing is confirmed after 
                    workload assessment, transport calculation, labor requirement, and cleaning intensity review 
                    by our sales manager. No booking is confirmed until final quotation approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={requestConfirmation}
                className="w-full btn-gold gap-2"
                size="lg"
              >
                <ClipboardCheck className="h-5 w-5" />
                Request Final Confirmation
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={openWhatsApp}
                  variant="outline"
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask Questions
                </Button>
                <Button 
                  onClick={() => onBookNow?.(result)}
                  variant="outline"
                  className="gap-2"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Final quotation confirmed after service detail verification by our team.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPriceCalculator;
