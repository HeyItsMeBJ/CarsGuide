import { supabase, Car } from '../lib/supabase';
import { useCarStore } from '../store/useCarStore';

// Dynamically fetch unique filter options directly from the DB
export const fetchFilterMetadata = async () => {
  const { data, error } = await supabase.from('cars').select('make, body_type, transmission_type, wheel_size_inches');
  if (error) throw new Error(error.message);
  
  // Extract unique values and sort them
  return {
    brands: [...new Set(data.map(c => c.make).filter(Boolean))].sort(),
    bodyTypes: [...new Set(data.map(c => c.body_type).filter(Boolean))].sort(),
    transmissions: [...new Set(data.map(c => c.transmission_type).filter(Boolean))].sort(),
    wheelSizes: [...new Set(data.map(c => c.wheel_size_inches).filter(Boolean))].sort((a, b) => a - b),
  };
};

export const fetchCars = async (): Promise<Car[]> => {
  const state = useCarStore.getState();
  let query = supabase.from('cars').select('*');

  // Search
  if (state.search) {
    const term = `%${state.search}%`;
    query = query.or(`make.ilike.${term},model.ilike.${term},variant.ilike.${term}`);
  }

  // Exact Match Filters
  if (state.brand) query = query.eq('make', state.brand);
  if (state.bodyType) query = query.eq('body_type', state.bodyType);
  if (state.transmission) query = query.eq('transmission_type', state.transmission);
  if (state.wheelSize) query = query.eq('wheel_size_inches', state.wheelSize);
  
  // Range & Threshold Filters
  if (state.minPrice) query = query.gte('ex_showroom_price', state.minPrice);
  if (state.maxPrice) query = query.lte('ex_showroom_price', state.maxPrice);
  if (state.minUserRating) query = query.gte('user_rating', state.minUserRating);
  if (state.minSafetyRating) query = query.gte('safety_rating', state.minSafetyRating);
  
  // Sorting
  switch (state.sortBy) {
    case 'latest': query = query.order('launch_date', { ascending: false }); break;
    case 'price_asc': query = query.order('ex_showroom_price', { ascending: true }); break;
    case 'price_desc': query = query.order('ex_showroom_price', { ascending: false }); break;
    case 'safety_desc': query = query.order('safety_rating', { ascending: false }); break;
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Car[];
};

export const fetchCarById = async (id: string): Promise<Car> => {
  const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data as Car;
};