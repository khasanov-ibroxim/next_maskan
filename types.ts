// types/property.ts
export interface Property {
  id: string;
  title: string;
  description: string;

  // Price & Numbers
  price: number;
  rooms: number;
  area: number;
  floor: number;
  totalFloors: number;

  // Location & Type
  district: string;
  type: string;

  // Details
  buildingType: string;
  renovation: string;
  layout?: string;
  balcony?: string;
  parking?: string;

  // Images
  images: string[];
  mainImage: string | null;

  // Contact
  phone: string;
  rieltor: string | {
    name: string;
    phone: string;
    avatar?: string;
  };

  // Dates
  createdAt: string;
}

// ✅ Raw API Property (with multilang fields)
export interface ApiProperty {
  id: string;

  // Multilingual fields (object with uz, ru, en, uz_cy)
  title: MultilangText;
  description: MultilangText;
  district: MultilangText;
  type: MultilangText;
  buildingType: MultilangText;
  renovation: MultilangText;
  layout?: MultilangText;
  balcony?: MultilangText;
  parking?: MultilangText;

  // Numbers
  price: number;
  rooms: number;
  area: number;
  floor: number;
  totalFloors: number;

  // Images
  images: string[];
  mainImage: string | null;

  // Contact
  phone: string;
  rieltor: string;

  // Dates
  createdAt: string;
}

// ✅ Multilang text type
export interface MultilangText {
  uz: string;
  ru: string;
  en: string;
  uz_cy: string;
}

// ✅ API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

// ✅ Filters
export interface PropertyFilters {
  lang: string;
  rooms?: string;
  location?: string;
  type?: 'Sotuv' | 'Arenda';
  min?: string;
  max?: string;
}