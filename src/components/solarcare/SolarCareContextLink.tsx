import { Link } from 'react-router-dom';
import { ArrowUpRight, Sun } from 'lucide-react';
import { SOLARCARE_PATH } from '@/data/solarcare';

export default function SolarCareContextLink() {
  return (
    <aside className="mt-6 border-t border-border pt-5">
      <p className="flex gap-2 items-center text-sm font-medium text-secondary"><Sun className="h-4 w-4" />Solar installations need specialist cleaning too.</p>
      <p className="mt-2 text-sm text-muted-foreground">For rooftop panels and solar installations at your property, WeWash SolarCare offers cleaning programmes and visual site reporting, subject to assessment.</p>
      <Link to={SOLARCARE_PATH} className="inline-flex items-center gap-2 mt-3 text-sm text-secondary">Explore WeWash SolarCare<ArrowUpRight className="h-4 w-4" /></Link>
    </aside>
  );
}