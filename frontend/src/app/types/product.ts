export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  quantity?: number;
  isOffer?: boolean;
  active?: boolean;
  franchiseId?: string;
  franchiseName?: string;
}
