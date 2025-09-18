/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { createQueryParams } from "@/lib/utils";
import type { Contributor, Options } from "@/types/types";
import { toast } from "sonner";
import { create } from "zustand";

interface SearchFilter {
  search: string;
  category: string;
}

interface QueryData {
  page?: number | undefined;
  limit?: number | undefined;
}

interface ContributorState {
  contributor: Contributor | null;
  contributors: Contributor[];
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

  fetchContributors: (options?: Options) => Promise<void>;
  getSingleContributor: (id: string) => Promise<void>;
  addContributor: (data: Contributor) => Promise<boolean>;
  updateContributor: (
    id: string | undefined,
    data: Partial<Contributor>
  ) => Promise<boolean>;
  deleteContributor: (id: string | undefined | null) => Promise<boolean>;
  allContributorsPdf: () => Promise<boolean>;
}

export const useContributorStore = create<ContributorState>((set, get) => ({
  contributor: null,
  contributors: [],
  pdfUrl: "",
  isLoading: false,
  isPdfLoading: false,
  isbtnLoading: false,

  searchFilter: {
    search: "",
    category: "",
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
  setSorting: (sortField, sortOrder) => {
    set({ sorting: { sortField, sortOrder } });
  },

  numOfRecords: 0,
  setNumOfRecords: (count) => set({ numOfRecords: count }),

  fetchContributors: async (options) => {
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

      const queryParams = createQueryParams(combinedData);

      const { data } = await axiosInstance.get(`/contributors${queryParams}`);
      if (data.success) {
        set({
          contributors: data?.data?.contributors,
          numOfRecords: data?.data?.total,
          isLoading: false,
        });
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error fetching contributors:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  getSingleContributor: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get(`/contributors/${id}`);
      if (data?.success) {
        set({ contributor: data?.data, isLoading: false });
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error fetching contributors:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
  addContributor: async (Contributor) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.post("/contributors", Contributor);
      console.log(" data", data);
      if (data?.success) {
        set({ contributors: [...get().contributors, data?.data] });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error adding contributor:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isbtnLoading: false });
    }
  },
  updateContributor: async (id, contributor) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.patch(
        `/contributors/${id}`,
        contributor
      );
      if (data?.success) {
        set({
          contributors: get().contributors.map((c) =>
            c._id === id ? data?.data : c
          ),
        });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error updating contributor:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isbtnLoading: false });
    }
  },
  deleteContributor: async (id) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.delete(`/contributors/${id}`);
      if (data?.success) {
        set({ contributors: get().contributors.filter((c) => c._id !== id) });
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error deleting contributor:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isbtnLoading: false });
    }
  },

  allContributorsPdf: async () => {
    set({ isPdfLoading: true });
    try {
      const { data } = await axiosInstance.get(`/contributors/all/pdf`);

      if (data?.success) {
        set({ pdfUrl: data?.data?.url });
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error: any) {
      console.error("Error getting contributors PDF:", error);
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      set({ isPdfLoading: false });
    }
  },
}));
