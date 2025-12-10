import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceAgentButtonProps {
  agentId: string;
  className?: string;
}

const VoiceAgentButton: React.FC<VoiceAgentButtonProps> = ({ agentId, className }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    // Load ElevenLabs widget script
    const existingScript = document.querySelector('script[src*="elevenlabs.io/convai-widget"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.onload = () => {
        setWidgetLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setWidgetLoaded(true);
    }

    return () => {
      // Cleanup widget on unmount
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        widget.remove();
      }
    };
  }, []);

  const toggleVoiceAgent = () => {
    setIsLoading(true);
    
    if (isActive) {
      // Remove the widget
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        widget.remove();
      }
      setIsActive(false);
      setIsLoading(false);
    } else {
      // Create and add the widget
      const existingWidget = document.querySelector('elevenlabs-convai');
      if (existingWidget) {
        existingWidget.remove();
      }

      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', agentId);
      document.body.appendChild(widget);
      
      setIsActive(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <Button
      onClick={toggleVoiceAgent}
      disabled={isLoading || !widgetLoaded}
      className={cn(
        "gap-2 transition-all duration-300",
        isActive 
          ? "bg-red-500 hover:bg-red-600 text-white" 
          : "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : isActive ? (
        <>
          <MicOff className="h-4 w-4" />
          End Voice Call
        </>
      ) : (
        <>
          <Phone className="h-4 w-4" />
          Talk to AI Assistant
        </>
      )}
    </Button>
  );
};

export default VoiceAgentButton;
