import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { fetchCarById } from "../api/cars";

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: car,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["car", id],
    queryFn: () => fetchCarById(id!),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="p-8 text-center animate-pulse">
        Loading specifications...
      </div>
    );
  if (error || !car)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load car details.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Catalog
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <header className="mb-10 border-b border-slate-100 pb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            {car.make} {car.model}
          </h1>
          <p className="text-xl text-slate-500 mb-4">
            {car.variant} • {car.body_type}
          </p>
          <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-xl">
            ₹{car.ex_showroom_price?.toLocaleString("en-IN")}
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            {car.description}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Performance Specs */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-900 flex items-center gap-2">
              Performance & Engine
            </h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Engine Type</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.engine_type || "-"}
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Fuel Type</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.fuel_type || "-"}
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Transmission</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.transmission_type || "-"}
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Top Speed</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.top_speed_kmh} km/h
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>0-100 km/h</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.acceleration_0_100} sec
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Mileage</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.mileage_kpl} km/l
                </span>
              </li>
            </ul>
          </div>

          {/* Dimensions & Ratings */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-900 flex items-center gap-2">
              Dimensions & Safety
            </h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Safety Rating</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.safety_rating} Stars
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>User Rating</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.user_rating}/5.0
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Trunk Space</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.trunk_space_liters} L
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Fuel Capacity</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.fuel_capacity_liters} L
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-2">
                <span>Wheel Size</span>{" "}
                <span className="font-medium text-slate-900">
                  {car.wheel_size_inches}"
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Color Availability */}
        <section className="mt-10 pt-10 border-t border-slate-100">
          <h3 className="font-semibold text-lg mb-4 text-slate-900">
            Available Colors
          </h3>
          <div className="flex flex-wrap gap-2">
            {car.exterior_colors?.map((color, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
              >
                <CheckCircle2 className="w-3 h-3 text-blue-500" /> {color}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
