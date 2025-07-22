
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface WebhookLog {
  id: string;
  booking_id: string;
  webhook_url: string;
  payload: any;
  response_status: number;
  response_body: string;
  success: boolean;
  retry_count: number;
  created_at: string;
  error_message?: string;
}

const WebhookMonitor: React.FC = () => {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Mock data for demonstration - in real implementation, this would come from Supabase
  const mockLogs: WebhookLog[] = [
    {
      id: '1',
      booking_id: 'booking-123',
      webhook_url: 'https://fixflow.app.n8n.cloud/webhook-test/68919d41-3f08-45ee-b018-e2b8ac1d5085',
      payload: { customer_name: 'John Doe', service_name: 'Car Wash' },
      response_status: 200,
      response_body: 'Success',
      success: true,
      retry_count: 0,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      booking_id: 'booking-124',
      webhook_url: 'https://fixflow.app.n8n.cloud/webhook-test/68919d41-3f08-45ee-b018-e2b8ac1d5085',
      payload: { customer_name: 'Jane Smith', service_name: 'House Cleaning' },
      response_status: 500,
      response_body: 'Internal Server Error',
      success: false,
      retry_count: 2,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      error_message: 'HTTP 500: Internal Server Error',
    },
  ];

  useEffect(() => {
    if (user?.role === 'admin') {
      loadWebhookLogs();
    }
  }, [user]);

  const loadWebhookLogs = async () => {
    setLoading(true);
    // Simulate API call - replace with actual Supabase query
    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (success: boolean, retryCount: number) => {
    if (success) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (retryCount > 0) return <RefreshCw className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (success: boolean, retryCount: number) => {
    if (success) return <Badge variant="default" className="bg-green-100 text-green-800">Delivered</Badge>;
    if (retryCount > 0) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Retried ({retryCount})</Badge>;
    return <Badge variant="destructive">Failed</Badge>;
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Webhook Delivery Monitor
        </CardTitle>
        <CardDescription>
          Track webhook delivery status for booking confirmations
        </CardDescription>
        <Button 
          onClick={loadWebhookLogs} 
          disabled={loading}
          size="sm"
          className="w-fit"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No webhook logs available
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.success, log.retry_count)}
                    <span className="font-medium">Booking {log.booking_id}</span>
                    {getStatusBadge(log.success, log.retry_count)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Customer:</span> {log.payload.customer_name}
                  </div>
                  <div>
                    <span className="font-medium">Service:</span> {log.payload.service_name}
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Webhook URL:</span>
                  <div className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                    {log.webhook_url}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    <span className="font-medium">Status:</span> {log.response_status}
                  </span>
                  <span>
                    <span className="font-medium">Response:</span> {log.response_body}
                  </span>
                </div>
                
                {log.error_message && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    <span className="font-medium">Error:</span> {log.error_message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookMonitor;
