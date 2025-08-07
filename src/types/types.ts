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

export interface FestivalReport {
  festival: Festival;
  year: number;
  totalCash: number;
  totalCollected: number;
  totalItemsValue: number;
  totalExpenses: number;
  contributionCount: number;
  expenseCount: number;
}

export interface Contributor {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  category: string;
  festivalId: string;
}

export interface contribution {
  _id: string;
  contributorId: string;
  festivalId: string;
  type: string;
  status: string;
  amount: number;
  date: string;
  itemName?: string;
  quantity?: number;
  estimatedValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  festivalId: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
