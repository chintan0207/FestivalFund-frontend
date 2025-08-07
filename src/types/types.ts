export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface FestivalStats {
  openingBalance: number;
  totalCollected: number;
  pendingAmount: number;
  totalExpenses: number;
  currentBalance: number;
}

export interface Festival {
  _id: string;
  name: string;
  year: number;
  openingBalance: number;
  stats: FestivalStats;
  createdAt: string;
  updatedAt: string;
}

export interface Contributor {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  category: string;
  festivalId: string;
}
