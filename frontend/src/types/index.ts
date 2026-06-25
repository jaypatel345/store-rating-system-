export type UserRole = 'ADMIN' | 'USER' | 'STORE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  overallRating?: number;
  userRating?: number | null;
  ownerId?: string;
  owner?: User;
  ratings?: Rating[];
}

export interface Rating {
  id: string;
  rating: number;
  userId: string;
  storeId: string;
  user?: User;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerDashboard {
  storeId: string;
  storeName: string;
  averageRating: number;
  totalRatings: number;
  ratings: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    rating: number;
    createdAt: string;
  }>;
}
