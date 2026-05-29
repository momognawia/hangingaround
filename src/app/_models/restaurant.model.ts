export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  cuisineType: string;
  priceLevel: 1 | 2 | 3 | 4;
  capacity: number;
  partnerStatus: boolean;
  discountPercent?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  imageUrl?: string;
  createdAt: Date;
}
