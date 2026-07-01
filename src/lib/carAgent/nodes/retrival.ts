import { supabase } from "../../supabase";
import { GraphState } from "../state";

export const retrieveData = async (state: typeof GraphState.State) => {
  let query = supabase.from("cars").select("*");

  const f = state.filters;

  if (f.maxPrice) query = query.lte("ex_showroom_price", f.maxPrice);
  if (f.minPrice) query = query.gte("ex_showroom_price", f.minPrice);
  if (f.make) query = query.ilike("make", `%${f.make}%`);
  if (f.bodyType) query = query.ilike("body_type", `%${f.bodyType}%`);
  if (f.fuelType) query = query.ilike("fuel_type", `%${f.fuelType}%`);
  if (f.isElectric !== undefined) query = query.eq("is_electric", f.isElectric);
  if (f.transmissionType) query = query.ilike("transmission_type", `%${f.transmissionType}%`);
  
  // Advanced parameters
  if (f.minMileageKpl) query = query.gte("mileage_kpl", f.minMileageKpl);
  if (f.minElectricRangeKm) query = query.gte("electric_range_km", f.minElectricRangeKm);
  if (f.minTrunkSpaceLiters) query = query.gte("trunk_space_liters", f.minTrunkSpaceLiters);
  if (f.minUserRating) query = query.gte("user_rating", f.minUserRating);
  if (f.minSafetyRating) query = query.gte("safety_rating", f.minSafetyRating);

  const { data, error } = await query.limit(4);
  return { recommendedCarList: error ? [] : data };
};