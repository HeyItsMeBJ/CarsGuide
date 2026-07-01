import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export interface Car {
  id: number;
  make: string;
  model: string;
  description: string | null;
  variant: string | null;
  body_type: string | null;
  launch_date: string | null;
  fuel_type: string | null;
  is_electric: boolean;
  engine_type: string | null;
  transmission_type: string | null;
  top_speed_kmh: number | null;
  acceleration_0_100: number | null;
  mileage_kpl: number | null;
  fuel_capacity_liters: number | null;
  battery_capacity_kwh: number | null;
  electric_range_km: number | null;
  trunk_space_liters: number | null;
  wheel_size_inches: number | null;
  ex_showroom_price: number | null;
  user_rating: number | null;
  safety_rating: number | null;
  exterior_colors: string[];
  interior_colors: string[];
}