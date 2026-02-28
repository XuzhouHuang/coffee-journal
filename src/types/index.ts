export interface Bean {
  id: number;
  name: string;
  process?: string | null;
  roastLevel?: string | null;
  flavorNotes?: string | null;
  score?: number | null;
  roaster?: { id: number; name: string } | null;
  region?: { id: number; country: string; region: string } | null;
  variety?: { id: number; name: string } | null;
}

export interface Meta {
  regions: { id: number; country: string; region: string }[];
  varieties: { id: number; name: string }[];
  roasters: { id: number; name: string }[];
}

export interface BeanDetail {
  id: number;
  name: string;
  process?: string | null;
  roastLevel?: string | null;
  flavorNotes?: string | null;
  score?: number | null;
  roaster?: { name: string; country: string } | null;
  region?: { country: string; region: string } | null;
  variety?: { name: string; flavor?: string | null } | null;
  purchases: BeanPurchase[];
  brewLogs: BrewLog[];
}

export interface BeanPurchase {
  id: number;
  price: number;
  weight: number;
  purchaseDate: string;
  source?: string | null;
  notes?: string | null;
  bean?: { id: number; name: string };
}

export interface CafePurchase {
  id: number;
  cafeName: string;
  location?: string | null;
  drinkName: string;
  drinkType?: string | null;
  price: number;
  purchaseDate: string;
  rating?: number | null;
}

export interface BrewLog {
  id: number;
  brewMethod: string;
  dose?: number | null;
  waterAmount?: number | null;
  ratio?: string | null;
  grindSize?: string | null;
  waterTemp?: number | null;
  brewTime?: string | null;
  rating?: number | null;
  notes?: string | null;
  brewDate: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
