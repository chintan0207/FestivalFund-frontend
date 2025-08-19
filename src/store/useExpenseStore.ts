/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import type { Expense } from "@/types/types";
import { toast } from "sonner";
import { create } from "zustand";

type ExpenseState = {
  expense: Expense | null;
  expenses: Expense[];
  isLoading: boolean;
  isbtnLoading: boolean;

  fetchExpenses: () => Promise<void>;
  getSingleExpense: (id: string) => Promise<void>;
  addExpense: (data: Expense) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
};

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expense: null,
  expenses: [],
  isLoading: false,
  isbtnLoading: false,

  fetchExpenses: async () => {
    set({ isLoading: true });

    try {
      const { data } = await axiosInstance.get("/expenses");

      if (data.success) {
        set({ expenses: data?.data?.expenses, isLoading: false });
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message``);
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (expense) => {
    set({ isbtnLoading: true });

    try {
      const { data } = await axiosInstance.post("/expenses", expense);

      if (data?.success) {
        set({ expenses: [...get().expenses, data?.data] });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error: any) {
      console.error("Error adding festival:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isbtnLoading: false });
    }
  },

  updateExpense: async (id, expense) => {
    set({ isbtnLoading: true });

    try {
      const { data } = await axiosInstance.patch(`/expenses/${id}`, expense);

      if (data?.success) {
        set({ expense: data?.data });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error: any) {
      console.error("Error updating expense:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isbtnLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isbtnLoading: true });

    try {
      const { data } = await axiosInstance.delete(`/expenses/${id}`);

      if (data?.success) {
        set({ expenses: get().expenses.filter((c) => c._id !== id) });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error: any) {
      console.error("Error deleting festival:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isbtnLoading: false });
    }
  },
}));
