import axiosInstance from "@/lib/axios";
import type { contribution } from "@/types/types";
import { toast } from "sonner";
import { create } from "zustand";

interface ContributionState {
  contribution: contribution | null;
  contributions: contribution[];
  isLoading: boolean;
  isbtnLoading: boolean;
  fetchContributions: () => Promise<void>;
  getSingleContribution: (id: string) => Promise<void>;
  addContribution: (data: contribution) => Promise<boolean>;
  updateContribution: (
    id: string,
    data: Partial<contribution>
  ) => Promise<boolean>;
  deleteContribution: (id: string) => Promise<boolean>;
  getContributionSlip: (id: string) => Promise<void>;
}

export const useContributionStore = create<ContributionState>()((set, get) => ({
  contribution: null,
  contributions: [],
  isLoading: false,
  isbtnLoading: false,

  fetchContributions: async () => {
    set({ isLoading: true });

    try {
      const { data } = await axiosInstance.get("/contributions");

      if (data.success) {
        set({ contributions: data?.data?.contributions, isLoading: false });
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
        set({ contributions: [...get().contributions, data?.data] });
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

    try {
      const { data } = await axiosInstance.patch(
        `/contributions/${id}`,
        contribution
      );

      if (data?.success) {
        set({ contribution: data?.data });
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

  deleteContribution: async (id: string) => {
    set({ isbtnLoading: true });

    try {
      const { data } = await axiosInstance.delete(`/contributions/${id}`);

      if (data?.success) {
        set({ contributions: get().contributions.filter((c) => c._id !== id) });
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
