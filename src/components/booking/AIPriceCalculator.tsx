import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  Loader2, 
  MessageCircle, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight
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
  notes: string;
  needsQuote: boolean;
}

interface AIPriceCalculatorProps {
  onPriceCalculated?: (price: number, result: PriceResult) => void;
  onBookNow?: (result: PriceResult) => void;
}

const serviceTypes = [
  { value: 'home-cleaning', label: 'Home Cleaning' },
  { value: 'deep-cleaning', label: 'Deep Cleaning' },
  { value: 'move-in-out', label: 'Move In/Out Cleaning' },
  { value: 'car-detailing', label: 'Car Detailing' },
  { value: 'fumigation', label: 'Fumigation & Pest Control' },
  { value: 'office-cleaning', label: 'Office Cleaning' },
  { value: 'facility-management', label: 'Facility Management' },
  { value: 'trained-maids', label: 'Trained Maids' },
  { value: 'other', label: 'Other / Multiple Services' },
];

const AIPriceCalculator: React.FC<AIPriceCalculatorProps> = ({ onPriceCalculated, onBookNow }) => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState('');

  const calculatePrice = async () => {
    if (!jobDescription.trim()) {
      setError('Please describe your job requirements');
      return;
    }

    setIsCalculating(true);
    setError('');
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('calculate-price', {
        body: {
          jobDescription: jobDescription.trim(),
          location: location.trim() || 'Lusaka',
          serviceType: serviceTypes.find(s => s.value === serviceType)?.label || serviceType,
        },
      });

      if (fnError) throw fnError;

      setResult(data);
      onPriceCalculated?.(data.estimatedPrice, data);
    } catch (err: any) {
      console.error('Price calculation error:', err);
      setError('Failed to calculate price. Please try again or contact us directly.');
    } finally {
      setIsCalculating(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello WeWash! I need a quote for:\n\nService: ${serviceTypes.find(s => s.value === serviceType)?.label || 'Cleaning Service'}\nLocation: ${location || 'Lusaka'}\n\nJob Details:\n${jobDescription}\n\nEstimated by AI: ZMW ${result?.estimatedPrice || 'N/A'}`
    );
    window.open(`https://wa.me/260768671420?text=${message}`, '_blank');
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-wewash-gold/10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-wewash-gold" />
          AI Price Estimator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get an <span className="font-semibold text-foreground">indicative starting estimate</span>. 
          Your final quote is provided after a professional assessment of your specific needs.
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Service Type */}
        <div>
          <Label className="mb-2 block">Service Type</Label>
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
          <Label className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4" />
            Location / Area
          </Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Kabulonga, Lusaka or 15km from CBD"
          />
        </div>

        {/* Job Description */}
        <div>
          <Label className="mb-2 block">Describe Your Job *</Label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Be as detailed as possible:
• Number of rooms/bedrooms
• Size of the space
• Current condition (clean, dirty, very dirty)
• Any special requirements (windows, carpets, etc.)
• For cars: vehicle type, interior/exterior
• Frequency (one-time or recurring)"
            rows={5}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The more details you provide, the more accurate the estimate
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
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
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="h-5 w-5" />
              Calculate Price
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4 animate-fade-up">
            {/* Price Display */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white text-center">
              <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Starting Estimate</p>
              <p className="text-4xl font-bold">From ZMW {result.estimatedPrice.toLocaleString()}</p>
              <p className="text-sm opacity-80 mt-1">
                Estimated range: ZMW {result.priceRange.min.toLocaleString()} – {result.priceRange.max.toLocaleString()}
              </p>
              <p className="text-xs opacity-60 mt-2 italic">
                Final price confirmed after professional assessment
              </p>
            </div>

            {/* Confidence Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                {result.confidence === 'high' && <CheckCircle2 className="h-4 w-4 inline mr-1" />}
                {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} Confidence
              </span>
            </div>

            {/* Breakdown */}
            {result.breakdown.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="font-semibold text-sm mb-2">Price Breakdown</p>
                <div className="space-y-1">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.item}</span>
                      <span className="font-medium">ZMW {item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {result.notes && (
              <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                💡 {result.notes}
              </p>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {result.needsQuote ? (
                <Button 
                  onClick={openWhatsApp}
                  className="btn-whatsapp col-span-2 gap-2"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Get Full Quote on WhatsApp
                </Button>
              ) : (
                <>
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
                    className="btn-gold gap-2"
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {result.needsQuote && (
              <p className="text-center text-sm text-muted-foreground">
                This job needs a custom quote. Our team will respond within 15 minutes!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPriceCalculator;
