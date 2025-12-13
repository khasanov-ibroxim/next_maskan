export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  district: string;
  rooms: number;
  area: number;
  floor: number;
  totalFloors: number;
  renovation: 'Euro' | 'Neo-classic' | 'Hi-Tech' | 'O\'rtacha' | 'Qora suvoq';
  images: string[];
  description: string;
  type: 'Kvartira' | 'Hovli' | 'Dacha';
  buildingType: 'Novostroyka' | 'Ikkilamchi';
  lat?: number;
  lng?: number;
  createdAt: string;
}

export interface FilterState {
  rooms: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}