import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Star, Shield, Fuel, Gauge, FilterX } from "lucide-react";
import { fetchCars, fetchFilterMetadata } from "../api/cars";
import { useCarStore, } from "../store/useCarStore";

const formatPrice = (price: number | null) => {
  if (!price) return "TBA";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
};

export default function Catalog() {
  const store = useCarStore();

  // Fetch unique dropdown values once
  const { data: metadata } = useQuery({
    queryKey: ["car-metadata"],
    queryFn: fetchFilterMetadata,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Fetch cars based on all filters
  const { data: cars, isLoading } = useQuery({
    queryKey: [
      "cars", store.search, store.sortBy, store.brand, store.bodyType, 
      store.transmission, store.minPrice, store.maxPrice, store.wheelSize, 
      store.minUserRating, store.minSafetyRating
    ],
    queryFn: fetchCars,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Left Sidebar Filters */}
      <aside className="w-64 shrink-0 hidden md:block">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-800">Filters</h2>
            <button onClick={store.resetFilters} className="text-sm text-slate-400 hover:text-blue-600 flex items-center gap-1">
              <FilterX className="w-4 h-4" /> Reset
            </button>
          </div>

          <div className="space-y-5">
            {/* Price Range */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={store.minPrice} onChange={(e) => store.setFilter('minPrice', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-slate-400">-</span>
                <input type="number" placeholder="Max" value={store.maxPrice} onChange={(e) => store.setFilter('maxPrice', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Dynamic Dropdowns */}
            {[
              { label: "Brand", key: "brand" as const, options: metadata?.brands },
              { label: "Body Type", key: "bodyType" as const, options: metadata?.bodyTypes },
              { label: "Transmission", key: "transmission" as const, options: metadata?.transmissions },
              { label: "Wheel Size (Inches)", key: "wheelSize" as const, options: metadata?.wheelSizes }
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-slate-700 block mb-2">{label}</label>
                <select value={store[key]} onChange={(e) => store.setFilter(key, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All {label}s</option>
                  {options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* Rating Dropdowns */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Min User Rating</label>
              <select value={store.minUserRating} onChange={(e) => store.setFilter('minUserRating', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any Rating</option>
                <option value="4.5">4.5 & Above</option>
                <option value="4.0">4.0 & Above</option>
                <option value="3.5">3.5 & Above</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Min Safety Rating</label>
              <select value={store.minSafetyRating} onChange={(e) => store.setFilter('minSafetyRating', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any Safety</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars & Above</option>
                <option value="3">3 Stars & Above</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Topbar: Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search make, model, or variant..."
              value={store.search}
              onChange={(e) => store.setFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={store.sortBy}
            onChange={(e) => store.setFilter('sortBy', e.target.value)}
            className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest Launch</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="safety_desc">Highest Safety Rating</option>
          </select>
        </div>

        {/* Car Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">Loading amazing cars...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {cars?.map((car) => (
              <Link to={`/car/${car.id}`} key={car.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all block cursor-pointer">
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {car.make} {car.model}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">{car.variant}</p>
                  </div>
                </div>

                <div className="my-4">
                  <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-lg">
                    {formatPrice(car.ex_showroom_price)}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                  {car.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 px-3 py-2.5 rounded-xl text-slate-700">
                    <Fuel className="w-4 h-4 text-blue-500" /> {car.fuel_type}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 px-3 py-2.5 rounded-xl text-slate-700">
                    <Gauge className="w-4 h-4 text-purple-500" /> {car.transmission_type}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {car.user_rating ? `${car.user_rating}/5.0` : "N/A"}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    {car.safety_rating ? `${car.safety_rating} Stars` : "N/A"}
                  </div>
                </div>
              </Link>
            ))}
            {cars?.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl border border-slate-100 p-12 text-center">
                <div className="text-slate-400 mb-2">
                  <FilterX className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No matches found</h3>
                <p className="text-slate-500 mt-1">Try adjusting or clearing your filters.</p>
                <button onClick={store.resetFilters} className="mt-4 text-blue-600 font-medium hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}