/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { createQueryParams } from "@/lib/utils";
import type { Expense, Options } from "@/types/types";
import { toast } from "sonner";
import { create } from "zustand";
import { useFestivalStore } from "./useFestivalStore";

interface SearchFilter {
  search: string;
  category: string;
}

interface QueryData {
  page?: number | undefined;
  limit?: number | undefined;
}

interface ExpenseState {
  expense: Expense | null;
  expenses: Expense[];
  pdfUrl: string;
  isLoading: boolean;
  isPdfLoading: boolean;
  isbtnLoading: boolean;

  searchFilter: SearchFilter;
  setSearchFilter: (searchFilter: SearchFilter) => void;

  queryData: QueryData;
  setQueryData: (queryData: QueryData) => void;

  sorting: {
    sortField: string;
    sortOrder: string;
  };
  setSorting: (sortField: string, sortOrder: string) => void;

  numOfRecords: number;
  setNumOfRecords: (count: number) => void;

  fetchExpenses: (options?: Options) => Promise<void>;
  getSingleExpense: (id: string) => Promise<void>;
  addExpense: (data: Expense) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string | null | undefined) => Promise<boolean>;
  getExpensesPdf: (festivalId: string) => Promise<boolean>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expense: null,
  expenses: [],
  pdfUrl: "",
  isLoading: false,
  isPdfLoading: false,
  isbtnLoading: false,

  searchFilter: {
    search: "",
    category: "",
  },
  setSearchFilter: (searchFilter) => set({ searchFilter }),

  queryData: {
    page: 1,
    limit: 10,
  },
  setQueryData: (queryData) => set({ queryData }),

  sorting: {
    sortField: "",
    sortOrder: "",
  },
  setSorting: (sortField, sortOrder) =>
    set({ sorting: { sortField, sortOrder } }),

  numOfRecords: 0,
  setNumOfRecords: (count) => set({ numOfRecords: count }),

  fetchExpenses: async (options) => {
    try {
      set({ isLoading: true });

      const { searchFilter, queryData, sorting } = get();

      let combinedData: any = {
        ...searchFilter,
        ...sorting,
      };

      if (!options?.skipPagination) {
        combinedData = {
          ...combinedData,
          ...queryData,
        };
      }

      if (options?.festivalId) {
        combinedData = {
          ...combinedData,
          festivalId: options?.festivalId,
        };
      }

      const queryParams = createQueryParams(combinedData);

      const { data } = await axiosInstance.get(`/expenses${queryParams}`);
      if (data.success) {
        set({
          expenses: data?.data?.expenses,
          numOfRecords: data?.data?.total,
          isLoading: false,
        });
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      set({ isLoading: false });
    }
  },

  getSingleExpense: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get(`/expenses/${id}`);
      if (data?.success) {
        set({ expense: data?.data, isLoading: false });
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error fetching expense:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expense");
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (expense) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.post("/expenses", expense);
      if (data?.success) {
        set({ expenses: [...get().expenses, data?.data.expense] });

        useFestivalStore.setState({ festivalStats: data.data.festivalStats });

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error adding expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      set({ isbtnLoading: false });
    }
  },

  updateExpense: async (id, expense) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.patch(`/expenses/${id}`, expense);
      if (data?.success) {
        set({
          expenses: get().expenses.map((e) =>
            e._id === id ? data?.data.expense : e
          ),
        });

        useFestivalStore.setState({ festivalStats: data.data.festivalStats });

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error updating expense:", error);
      toast.error(error.response?.data?.message || "Failed to update expense");
    } finally {
      set({ isbtnLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.delete(`/expenses/${id}`);
      if (data?.success) {
        set({ expenses: get().expenses.filter((e) => e._id !== id) });

        useFestivalStore.setState({ festivalStats: data.data.festivalStats });

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    } finally {
      set({ isbtnLoading: false });
    }
  },

  getExpensesPdf: async (festivalId) => {
    set({ isPdfLoading: true });
    try {
      const { data } = await axiosInstance.get(`/expenses/pdf/${festivalId}`);

      if (data.success) {
        set({ pdfUrl: data?.data?.url });
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error getting contributions PDF:", error);
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      set({ isPdfLoading: false });
    }
  },
}));
