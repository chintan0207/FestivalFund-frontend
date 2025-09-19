/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { Festival, FestivalReport, FestivalStats } from "@/types/types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { persist } from "zustand/middleware";

export interface FestivalState {
  currentFestival: Festival | null;
  setCurrentFestival: (festival: Festival) => void;
  festivals: Festival[];
  festivalStats: FestivalStats;
  FestivalReport: FestivalReport;
  pdfUrl: string;

  isLoading: boolean;
  isbtnLoading: boolean;
  isStatsLoading: boolean;
  isPdfLoading: boolean;

  fetchFestivals: () => Promise<void>;
  addFestival: (data: {
    name: string;
    year: number;
    openingBalance: number;
  }) => Promise<boolean>;

  updateFestival: (id: string, data: Partial<Festival>) => Promise<boolean>;
  deleteFestival: (id: string) => Promise<boolean>;
  getFestivalStats: (id: string | undefined) => Promise<void>;
  getFestivalReport: (id: string) => Promise<boolean>;
}

export const useFestivalStore = create<FestivalState>()(
  persist(
    (set, get) => ({
      currentFestival: null,
      setCurrentFestival: (festival: Festival) =>
        set({
          currentFestival: festival,
          festivalStats: festival.stats ?? null,
        }),
      festivals: [],
      festivalStats: {
        openingBalance: 0,
        totalCollected: 0,
        pendingAmount: 0,
        totalExpenses: 0,
        currentBalance: 0,
        categoryTotals: {},
      },
      FestivalReport: {
        festival: {} as Festival,
        year: 0,
        totalCash: 0,
        totalCollected: 0,
        totalItemsValue: 0,
        totalExpenses: 0,
        contributionCount: 0,
        expenseCount: 0,
      },
      pdfUrl: "",

      isLoading: false,
      isbtnLoading: false,
      isStatsLoading: false,
      isPdfLoading: false,

      fetchFestivals: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.get("/festivals");
          if (data?.success) {
            set({ festivals: data?.data, isLoading: false });

            if (!get().currentFestival && data.data.length > 0) {
              const firstFestival = data.data[0];
              set({
                currentFestival: firstFestival,
                festivalStats: firstFestival.stats ?? null,
              });
            }
          } else {
            toast.error(data?.message);
          }
          return data.success;
        } catch (error: any) {
          console.error("Error fetching festivals:", error);
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
        } catch (error: any) {
          console.error("Error adding festival:", error);
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
        } catch (error: any) {
          console.error("Error updating festival:", error);
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
              festivals: get().festivals.filter(
                (festival) => festival._id !== id
              ),
            });
            toast.success(data?.message);
          } else {
            toast.error(data?.message);
          }
          return data?.success;
        } catch (error: any) {
          console.error("Error deleting festival:", error);
        } finally {
          set({ isbtnLoading: false });
        }
      },

      getFestivalStats: async (id) => {
        set({ isStatsLoading: true });
        try {
          const { data } = await axiosInstance.get(
            `/reports/festival/${id}/stats`
          );
          if (data?.success) {
            set({ festivalStats: data?.data, isStatsLoading: false });
          } else {
            toast.error(data?.message);
          }
          return data?.success;
        } catch (error: any) {
          console.error("Error fetching festivals:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isStatsLoading: false });
        }
      },

      getFestivalReport: async (festivalId) => {
        set({ isPdfLoading: true });
        try {
          const { data } = await axiosInstance.get(
            `/reports/festival/${festivalId}`
          );

          if (data?.success) {
            set({ pdfUrl: data?.data?.url });
          } else {
            toast.error(data?.message);
          }
          return data?.success;
        } catch (error: any) {
          console.error("Error getting contributions PDF:", error);
        } finally {
          set({ isPdfLoading: false });
        }
      },
    }),
    {
      name: "festival-storage",
      partialize: (state) => ({
        currentFestival: state.currentFestival,
        festivals: state.festivals,
        festivalStats: state.festivalStats,
        FestivalReport: state.FestivalReport,
      }),
    }
  )
);
