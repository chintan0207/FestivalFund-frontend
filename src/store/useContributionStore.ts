/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import type { contribution, Options } from "@/types/types";
import { toast } from "sonner";
import { create } from "zustand";
import { useFestivalStore } from "./useFestivalStore";
import { createQueryParams } from "@/lib/utils";

interface SearchFilter {
  search: string;
  status: string;
}

interface QueryData {
  page?: number | undefined;
  limit?: number | undefined;
}

interface ContributionState {
  contribution: contribution | null;
  contributions: contribution[];
  isLoading: boolean;
  isbtnLoading: boolean;

  searchFilter: SearchFilter;
  setSearchFilter: (searchFilter: SearchFilter) => void;

  queryData: QueryData;
  setQueryData: (queryData: QueryData) => void;

  sorting: {
    sortField: string;
    sortOrder: string;
  };
  setSorting: (sorting: { sortField: string; sortOrder: string }) => void;

  numOfRecords: number;
  setNumOfRecords: (count: number) => void;

  fetchContributions: (options?: Options) => Promise<void>;
  getSingleContribution: (id: string) => Promise<void>;
  addContribution: (data: contribution) => Promise<boolean>;
  updateContribution: (
    id: string,
    data: Partial<contribution>
  ) => Promise<boolean>;
  deleteContribution: (id: string | undefined | null) => Promise<boolean>;
  getContributionSlip: (id: string) => Promise<void>;
}

export const useContributionStore = create<ContributionState>()((set, get) => ({
  contribution: null,
  contributions: [],
  isLoading: false,
  isbtnLoading: false,

  searchFilter: {
    search: "",
    status: "",
  },
  setSearchFilter: (searchFilter) => {
    set({ searchFilter });
  },

  queryData: {
    page: 1,
    limit: 10,
  },
  setQueryData: (queryData) => {
    set({ queryData });
  },

  sorting: {
    sortField: "",
    sortOrder: "",
  },
  setSorting: ({ sortField, sortOrder }) => {
    set({ sorting: { sortField, sortOrder } });
  },

  numOfRecords: 0,
  setNumOfRecords: (count) => set({ numOfRecords: count }),

  fetchContributions: async (options) => {
    set({ isLoading: true });

    try {
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

      const { data } = await axiosInstance.get(`/contributions${queryParams}`);

      if (data.success) {
        set({
          contributions: data?.data?.contributions,
          numOfRecords: data?.data?.total,
          isLoading: false,
        });
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error) {
      console.error("Error fetching contributions:", error);
      toast.error("Failed to load contributions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSingleContribution: async (id: string) => {
    set({ isLoading: true });

    try {
      const { data } = await axiosInstance.get(`/contributions/${id}`);

      if (data.success) {
        set({ contribution: data?.data, isLoading: false });
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error) {
      console.error("Error fetching contribution:", error);
      toast.error("Failed to load contribution");
    } finally {
      set({ isLoading: false });
    }
  },

  addContribution: async (contribution) => {
    set({ isbtnLoading: true });

    try {
      const { data } = await axiosInstance.post("/contributions", contribution);

      if (data?.success) {
        set({
          contributions: [...get().contributions, data?.data?.contribution],
        });

        useFestivalStore.setState({ festivalStats: data.data.festivalStats });

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error) {
      console.error("Error adding contribution:", error);
      toast.error("Failed to add contribution");
    } finally {
      set({ isbtnLoading: false });
    }
  },
  updateContribution: async (id: string, contribution) => {
    set({ isbtnLoading: true });
    console.log("contribution", contribution);
    try {
      const { data } = await axiosInstance.patch(
        `/contributions/${id}`,
        contribution
      );

      if (data?.success) {
        set({
          contributions: get().contributions.map((c) =>
            c._id === id ? data.data.contribution : c
          ),
        });

        useFestivalStore.setState({ festivalStats: data.data.festivalStats });

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error) {
      console.error("Error updating contribution:", error);
      toast.error("Failed to update contribution");
    } finally {
      set({ isbtnLoading: false });
    }
  },

  deleteContribution: async (id) => {
    set({ isbtnLoading: true });

    try {
      const { data } = await axiosInstance.delete(`/contributions/${id}`);

      if (data?.success) {
        const deletedId = data?.data?.contribution?._id || id;

        set({
          contributions: get().contributions.filter((c) => c._id !== deletedId),
        });

        useFestivalStore.setState({ festivalStats: data.data.festivalStats });

        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error) {
      console.error("Error deleting contribution:", error);
      toast.error("Failed to delete contribution");
    } finally {
      set({ isbtnLoading: false });
    }
  },

  getContributionSlip: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get(`/contributions/${id}/slip`);

      if (data.success) {
        set({ contribution: data?.data?.slip, isLoading: false });
      } else {
        toast.error(data?.message);
      }

      return data?.success;
    } catch (error) {
      console.error("Error getting contribution slip:", error);
      toast.error("Failed to get contribution slip");
    } finally {
      set({ isLoading: false });
    }
  },
}));
