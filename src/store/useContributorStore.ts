import axiosInstance from "@/lib/axios";
import type { Contributor } from "@/types/types";
import { toast } from "sonner";
import { create } from "zustand";

interface ContributorState {
  contributor: Contributor | null;
  contributors: Contributor[];
  isLoading: boolean;
  isbtnLoading: boolean;

  fetchContributors: () => Promise<void>;
  getSingleContributor: (id: string) => Promise<void>;
  addContributor: (data: Contributor) => Promise<boolean>;
  updateContributor: (
    id: string,
    data: Partial<Contributor>
  ) => Promise<boolean>;
  deleteContributor: (id: string) => Promise<boolean>;
}

export const useContributorStore = create<ContributorState>((set, get) => ({
  contributor: null,
  contributors: [],
  isLoading: false,
  isbtnLoading: false,

  fetchContributors: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get("/contributors");
      if (data.success) {
        set({ contributors: data?.data?.contributors, isLoading: false });
      } else {
        toast.error(data?.message);
      }
      return data?.success;
    } catch (error) {
      console.error("Error fetching festivals:", error);
      toast.error("Failed to load festivals.");
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
    } catch (error) {
      console.error("Error fetching festivals:", error);
      toast.error("Failed to load festivals.");
    } finally {
      set({ isLoading: false });
    }
  },
  addContributor: async (Contributor) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.post("/contributors", Contributor);
      if (data?.success) {
        set({ contributors: [...get().contributors, data?.data] });
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
  updateContributor: async (id, contributor) => {
    set({ isbtnLoading: true });
    try {
      const { data } = await axiosInstance.patch(
        `/contributors/${id}`,
        contributor
      );
      if (data?.success) {
        set({ contributor: data?.data });
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
    } catch (error) {
      console.error("Error deleting festival:", error);
      toast.error("Failed to delete festival.");
    } finally {
      set({ isbtnLoading: false });
    }
  },
}));
