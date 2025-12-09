import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  base_price: number;
  duration_hours: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  service_categories?: ServiceCategory | null;
}

export interface PackageTier {
  id: string;
  name: string;
  type: 'standard' | 'premium' | 'vip';
  description: string | null;
  price_multiplier: number;
  features: string[];
  is_active: boolean | null;
  created_at: string;
}

export const useServices = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<PackageTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 SERVICES DEBUG: Starting data fetch...');
      
      // Fetch categories
      console.log('🔍 SERVICES DEBUG: Fetching categories...');
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('🔍 SERVICES DEBUG: Categories error:', categoriesError);
        throw categoriesError;
      }
      console.log('🔍 SERVICES DEBUG: Categories fetched:', categoriesData?.length || 0);

      // Fetch services with categories
      console.log('🔍 SERVICES DEBUG: Fetching services...');
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (*)
        `)
        .eq('is_active', true)
        .order('name');

      if (servicesError) {
        console.error('🔍 SERVICES DEBUG: Services error:', servicesError);
        throw servicesError;
      }
      console.log('🔍 SERVICES DEBUG: Services fetched:', servicesData?.length || 0);

      // Fetch packages
      console.log('🔍 SERVICES DEBUG: Fetching packages...');
      const { data: packagesData, error: packagesError } = await supabase
        .from('package_tiers')
        .select('*')
        .eq('is_active', true)
        .order('price_multiplier');

      if (packagesError) {
        console.error('🔍 SERVICES DEBUG: Packages error:', packagesError);
        throw packagesError;
      }
      console.log('🔍 SERVICES DEBUG: Packages fetched:', packagesData?.length || 0);

      setCategories(categoriesData || []);
      setServices(servicesData as Service[] || []);
      // Cast package tiers with proper type handling
      const typedPackages: PackageTier[] = (packagesData || []).map(pkg => ({
        ...pkg,
        type: pkg.type as 'standard' | 'premium' | 'vip',
        features: Array.isArray(pkg.features) ? pkg.features as string[] : []
      }));
      setPackages(typedPackages);
      setError(null);
      
      console.log('🔍 SERVICES DEBUG: Data fetch completed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('🔍 SERVICES DEBUG: Fetch error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getServicesByCategory = (categoryId: string) => {
    return services.filter(service => service.category_id === categoryId);
  };

  const getServicePrice = (serviceId: string, packageId?: string) => {
    const service = services.find(s => s.id === serviceId);
    const packageTier = packageId ? packages.find(p => p.id === packageId) : null;
    
    if (!service) return 0;
    
    const basePrice = service.base_price;
    const multiplier = packageTier ? packageTier.price_multiplier : 1;
    
    return basePrice * multiplier;
  };

  return {
    categories,
    services,
    packages,
    loading,
    error,
    getServicesByCategory,
    getServicePrice,
    refetch: fetchData,
  };
};