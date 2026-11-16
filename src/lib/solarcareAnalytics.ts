export function trackSolarCare(event: string, details: Record<string, string> = {}) {
  // Use the existing tag and its consent state; never create a second tracker or send contact details.
  const tag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  tag?.('event', `solarcare_${event}`, { service_division: 'SolarCare', ...details });
}