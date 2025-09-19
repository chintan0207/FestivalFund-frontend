import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens, User } from "../types/types";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";

interface AuthState {
  tokens: AuthTokens;
  user: User | null;
  isAdmin: boolean;

  isAuthenticated: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User) => void;

  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: User) => Promise<boolean>;
  getMe: () => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: {
        accessToken: null,
        refreshToken: null,
      },
      user: null,
      isAdmin: false,
      isAuthenticated: false,
      isLoginLoading: false,
      isRegisterLoading: false,

      setTokens: (tokens) => {
        set({
          tokens,
          isAuthenticated: !!tokens.accessToken,
        });
      },

      setUser: (user) => set({ user }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoginLoading: true });
          const response = await axiosInstance.post("/auth/login", {
            email,
            password,
          });

          const { accessToken, refreshToken, loggedInUser } =
            response.data.data;

          if (loggedInUser?.role === "admin") {
            set({ isAdmin: true });
          } else {
            set({ isAdmin: false });
          }

          if (response?.data?.success) {
            set({
              tokens: { accessToken, refreshToken },
              isAuthenticated: true,
              user: loggedInUser,
            });

            toast.success(response?.data?.message || "Login successful");
          }
          return response?.data?.success;
        } catch (error) {
          console.error("Login error:", error);
        } finally {
          set({ isLoginLoading: false });
        }
      },

      register: async (userData: User) => {
        set({ isRegisterLoading: true });
        try {
          const response = await axiosInstance.post(`/auth/register`, userData);
          const { accessToken, refreshToken, loggedInUser } =
            response.data.data;

          if (response?.data?.success) {
            set({
              tokens: { accessToken, refreshToken },
              isAuthenticated: true,
              user: loggedInUser,
            });

            toast.success(response?.data?.message || "Registration successful");
          }
          return response?.data?.success;
        } catch (error) {
          console.error("Registration error:", error);
        } finally {
          set({ isRegisterLoading: false });
        }
      },

      getMe: async () => {
        try {
          const response = await axiosInstance.get("/auth/me");
          if (response?.data?.success) {
            set({
              user: response?.data?.data,
            });
          }
          return response?.data?.success;
        } catch (error) {
          console.error("Get me error:", error);
        }
      },

      logout: async () => {
        try {
          const { tokens } = useAuthStore.getState();

          await axiosInstance.post("/auth/logout", {
            refreshToken: tokens.refreshToken,
          });

          set({
            tokens: { accessToken: null, refreshToken: null },
            isAuthenticated: false,
            user: null,
            isAdmin: false,
          });

          toast.success("Logout successful");
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    {
      name: "auth-store",
    }
  )
);
