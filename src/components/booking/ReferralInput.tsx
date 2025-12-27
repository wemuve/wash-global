import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Check, X, Loader2 } from 'lucide-react';
import { useReferral } from '@/hooks/useReferral';

interface ReferralInputProps {
  onValidCode: (code: string) => void;
  initialCode?: string;
}

const ReferralInput: React.FC<ReferralInputProps> = ({ onValidCode, initialCode = '' }) => {
  const { validateReferralCode } = useReferral();
  const [code, setCode] = useState(initialCode);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleValidate = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    const isValid = await validateReferralCode(code);
    setValidationStatus(isValid ? 'valid' : 'invalid');
    setIsValidating(false);

    if (isValid) {
      onValidCode(code.toUpperCase());
    }
  };

  const handleClear = () => {
    setCode('');
    setValidationStatus('idle');
    onValidCode('');
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Gift className="h-4 w-4 text-wewash-gold" />
        Referral Code (Optional)
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setValidationStatus('idle');
            }}
            placeholder="Enter referral code"
            className={`font-mono tracking-wider ${
              validationStatus === 'valid' 
                ? 'border-success ring-1 ring-success' 
                : validationStatus === 'invalid'
                  ? 'border-destructive ring-1 ring-destructive'
                  : ''
            }`}
            disabled={validationStatus === 'valid'}
          />
          {validationStatus === 'valid' && (
            <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-success text-success-foreground">
              <Check className="h-3 w-3 mr-1" />
              K50 off!
            </Badge>
          )}
        </div>
        {validationStatus === 'valid' ? (
          <Button variant="outline" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleValidate}
            disabled={!code.trim() || isValidating}
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Apply'
            )}
          </Button>
        )}
      </div>
      {validationStatus === 'invalid' && (
        <p className="text-xs text-destructive">Invalid referral code. Please check and try again.</p>
      )}
      {validationStatus === 'valid' && (
        <p className="text-xs text-success">Referral code applied! The referrer will receive K50 credit after your service.</p>
      )}
    </div>
  );
};

export default ReferralInput;
