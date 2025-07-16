import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  base_price: number;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  service_categories?: ServiceCategory;
}

export interface PackageTier {
  id: string;
  name: string;
  type: 'standard' | 'premium' | 'vip';
  description: string;
  price_multiplier: number;
  features: string[];
  is_active: boolean;
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
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch services with categories
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (*)
        `)
        .eq('is_active', true)
        .order('name');

      if (servicesError) throw servicesError;

      // Fetch packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('package_tiers')
        .select('*')
        .eq('is_active', true)
        .order('price_multiplier');

      if (packagesError) throw packagesError;

      setCategories(categoriesData || []);
      setServices(servicesData || []);
      setPackages(packagesData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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