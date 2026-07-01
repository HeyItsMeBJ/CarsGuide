import { create } from 'zustand';

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'safety_desc';

interface FilterState {
  search: string;
  sortBy: SortOption;
  
  // Filters
  brand: string;
  bodyType: string;
  transmission: string;
  minPrice: number | '';
  maxPrice: number | '';
  wheelSize: string;
  minUserRating: number | '';
  minSafetyRating: number | '';
  
  // Actions
  setFilter: (key: keyof Omit<FilterState, 'setFilter' | 'resetFilters'>, value: unknown) => void;
  resetFilters: () => void;
}

export const useCarStore = create<FilterState>((set) => ({
  search: '',
  sortBy: 'latest',
  brand: '',
  bodyType: '',
  transmission: '',
  minPrice: '',
  maxPrice: '',
  wheelSize: '',
  minUserRating: '',
  minSafetyRating: '',

  setFilter: (key, value) => set({ [key]: value }),
  
  resetFilters: () => set({
    search: '', sortBy: 'latest', brand: '', bodyType: '', transmission: '', 
    minPrice: '', maxPrice: '', wheelSize: '', minUserRating: '', minSafetyRating: ''
  })
}));