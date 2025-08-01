import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens, User } from "../types/types";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";

interface AuthState {
  tokens: AuthTokens;
  user: User | null;

  isAuthenticated: boolean;
  isLoginLoading: boolean;
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
      isAuthenticated: false,
      isLoginLoading: false,

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

          if (response?.data?.success) {
            set({
              tokens: { accessToken, refreshToken },
              isAuthenticated: true,
              setUser: loggedInUser,
            });

            toast.success(response?.data?.message || "Login successful");
          }
          return response?.data?.success;
        } catch (error) {
          console.error("Login error:", error);
        }
      },

      register: async (userData: User) => {
        try {
          const response = await axiosInstance.post("/auth/register", userData);
          const { accessToken, refreshToken, loggedInUser } =
            response.data.data;

          if (response?.data?.success) {
            set({
              tokens: { accessToken, refreshToken },
              isAuthenticated: true,
              setUser: loggedInUser,
            });

            toast.success(response?.data?.message || "Registration successful");
          }
          return response?.data?.success;
        } catch (error) {
          console.error("Registration error:", error);
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

      logout: () => {
        try {
          axiosInstance.post("/auth/logout");
          set({
            tokens: { accessToken: null, refreshToken: null },
            isAuthenticated: false,
            user: null,
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
