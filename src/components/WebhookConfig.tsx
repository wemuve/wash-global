
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface WebhookSettings {
  enabled: boolean;
  url: string;
  retryAttempts: number;
  timeoutSeconds: number;
  customHeaders: string;
}

const WebhookConfig: React.FC = () => {
  const [settings, setSettings] = useState<WebhookSettings>({
    enabled: true,
    url: 'https://fixflow.app.n8n.cloud/webhook-test/68919d41-3f08-45ee-b018-e2b8ac1d5085',
    retryAttempts: 3,
    timeoutSeconds: 30,
    customHeaders: '',
  });
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simulate saving to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Webhook configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save webhook configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!settings.url) {
      toast({
        title: "Test Failed",
        description: "Please enter a webhook URL before testing.",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    
    try {
      const testPayload = {
        test: true,
        booking_id: "test-booking-" + Date.now(),
        customer_name: "Test Customer",
        service_name: "Test Service",
        timestamp: new Date().toISOString(),
        message: "This is a test webhook from WeWash booking system",
      };

      const response = await fetch(settings.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.customHeaders ? JSON.parse(settings.customHeaders) : {}),
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        toast({
          title: "Test Successful",
          description: "Webhook test completed successfully!",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Failed to send test webhook",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Webhook Configuration
        </CardTitle>
        <CardDescription>
          Configure webhook settings for booking confirmations and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="webhook-enabled"
            checked={settings.enabled}
            onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
          />
          <Label htmlFor="webhook-enabled">Enable webhook notifications</Label>
        </div>

        {settings.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://your-webhook-endpoint.com/webhook"
                value={settings.url}
                onChange={(e) => setSettings({ ...settings, url: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                This is your n8n webhook URL where booking data will be sent
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retry-attempts">Retry Attempts</Label>
                <Input
                  id="retry-attempts"
                  type="number"
                  min="0"
                  max="5"
                  value={settings.retryAttempts}
                  onChange={(e) => setSettings({ ...settings, retryAttempts: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="5"
                  max="60"
                  value={settings.timeoutSeconds}
                  onChange={(e) => setSettings({ ...settings, timeoutSeconds: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-headers">Custom Headers (JSON)</Label>
              <Textarea
                id="custom-headers"
                placeholder='{"Authorization": "Bearer token", "X-Custom-Header": "value"}'
                value={settings.customHeaders}
                onChange={(e) => setSettings({ ...settings, customHeaders: e.target.value })}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Optional custom headers to send with webhook requests (must be valid JSON)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleTest}
                disabled={testing || !settings.url}
                variant="outline"
                className="flex-1"
              >
                {testing ? (
                  <>
                    <TestTube className="h-4 w-4 mr-2 animate-pulse" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Webhook
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Webhook Data Format</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Your n8n workflow will receive the following data structure:
          </p>
          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
{`{
  "booking_id": "uuid",
  "customer_name": "string",
  "customer_phone": "string",
  "customer_email": "string",
  "service_name": "string",
  "service_category": "string",
  "scheduled_date": "YYYY-MM-DD",
  "scheduled_time": "HH:MM AM/PM",
  "total_amount": "number",
  "whatsapp_message": "formatted message",
  "email_content": "formatted email",
  "is_car_detailing": "boolean",
  "vehicle_details": "object (if applicable)"
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
