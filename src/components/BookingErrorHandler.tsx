
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingErrorHandlerProps {
  error: string | null;
  onRetry?: () => void;
  onClear?: () => void;
}

const BookingErrorHandler: React.FC<BookingErrorHandlerProps> = ({ 
  error, 
  onRetry, 
  onClear 
}) => {
  if (!error) return null;

  const getErrorMessage = (error: string) => {
    if (error.includes('violates row-level security')) {
      return 'There was an authentication issue. Please try logging in or continue as a guest.';
    }
    if (error.includes('duplicate key value')) {
      return 'This booking already exists. Please check your bookings or try different details.';
    }
    if (error.includes('foreign key constraint')) {
      return 'Invalid service or package selected. Please refresh the page and try again.';
    }
    return error;
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Booking Error</AlertTitle>
      <AlertDescription className="mt-2">
        {getErrorMessage(error)}
        <div className="flex gap-2 mt-3">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-8"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          )}
          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8"
            >
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default BookingErrorHandler;
