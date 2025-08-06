import { create } from "zustand";
import type { Festival } from "@/types/types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export interface FestivalState {
  currentFestival: Festival | null;
  setCurrentFestival: (festival: Festival) => void;
  festivals: Festival[];
  isLoading: boolean;
  isbtnLoading: boolean;
  fetchFestivals: () => Promise<void>;
  addFestival: (data: {
    name: string;
    year: number;
    openingBalance: number;
  }) => Promise<boolean>;
  updateFestival: (id: string, data: Partial<Festival>) => Promise<boolean>;
  deleteFestival: (id: string) => Promise<boolean>;
}

export const useFestivalStore = create<FestivalState>((set, get) => ({
  currentFestival: null,
  setCurrentFestival: (festival: Festival) =>
    set({ currentFestival: festival }),
  festivals: [],
  isLoading: false,
  isbtnLoading: false,

  fetchFestivals: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get("/festivals");
      if (data.success) {
        set({ festivals: data?.data, isLoading: false });
      } else {
        toast.error(data?.message);
      }
      return data.success;
    } catch (error) {
      console.error("Error fetching festivals:", error);
      toast.error("Failed to load festivals.");
    } finally {
      set({ isLoading: false });
    }
  },

  addFestival: async (festivalData) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.post("/festivals", festivalData);
      if (data?.success) {
        set({
          festivals: [...get().festivals, data?.data],
        });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error) {
      console.error("Error adding festival:", error);
      toast.error("Failed to add festival.");
    } finally {
      set({ isbtnLoading: false });
    }
  },

  updateFestival: async (id, updatedData) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.patch(
        `/festivals/${id}`,
        updatedData
      );
      if (data?.success) {
        set({
          festivals: get().festivals.map((festival) =>
            festival._id === id ? data?.data : festival
          ),
        });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error) {
      console.error("Error updating festival:", error);
      toast.error("Failed to update festival.");
    } finally {
      set({ isbtnLoading: false });
    }
  },

  deleteFestival: async (id) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.delete(`/festivals/${id}`);
      if (data?.success) {
        set({
          festivals: get().festivals.filter((festival) => festival._id !== id),
        });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error) {
      console.error("Error deleting festival:", error);
      toast.error("Failed to delete festival.");
    } finally {
      set({ isbtnLoading: false });
    }
  },
}));
