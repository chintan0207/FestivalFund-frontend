/* eslint-disable @typescript-eslint/no-explicit-any */
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
  categoryTotals: Record<string, number>;
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
  _id?: string | null | undefined;
  name: string;
  phoneNumber?: string;
  address?: string;
  category: string;
  festivalId?: string;
}

export interface contribution {
  contributor?: any;
  _id?: string | any;
  contributorId?: string;
  festivalId?: string;
  name?: string;
  category?: string;
  phoneNumber?: string;
  address?: string;
  type?: string;
  status?: string;
  amount?: number | any;
  date?: any;
  itemName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  _id: string;
  festivalId: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type Options = {
  skipPagination?: boolean;
  search?: string;
  category?: string;
  festivalId?: string;
};
