import { create } from "zustand";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  textPrimary: string;
  textMuted: string;
  success: string;
  warning: string;
  danger: string;
  links: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: string;
  colors: ThemeColors;
}

const themes: Theme[] = [
  {
    id: "festive-pink",
    name: "Festive Pink",
    description: "Original festive theme with pink and amber",
    category: "vibrant",
    colors: {
      primary: "#E91E63",
      secondary: "#FFC107",
      background: "#F4F6F8",
      card: "#FFFFFF",
      textPrimary: "#212121",
      textMuted: "#616161",
      success: "#4CAF50",
      warning: "#FF9800",
      danger: "#F44336",
      links: "#3F51B5",
    },
  },
  {
    id: "monochrome-pro",
    name: "Monochrome Pro",
    description: "Classic black & white with electric blue accents",
    category: "modern",
    colors: {
      primary: "#000000",
      secondary: "#0066FF",
      background: "#FAFAFA",
      card: "#FFFFFF",
      textPrimary: "#000000",
      textMuted: "#6B7280",
      success: "#0066FF",
      warning: "#F59E0B",
      danger: "#EF4444",
      links: "#0066FF",
    },
  },
];

interface ThemeStore {
  themes: Theme[];
  currentTheme: Theme;
  setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const saved = localStorage.getItem("festival-tracker-theme");
  const defaultTheme = themes.find((t) => t.id === saved) || themes[0];

  applyThemeVariables(defaultTheme.colors);

  return {
    themes,
    currentTheme: defaultTheme,
    setTheme: (id: string) => {
      const theme = themes.find((t) => t.id === id);
      if (!theme) return;
      applyThemeVariables(theme.colors);
      localStorage.setItem("festival-tracker-theme", theme.id);
      set({ currentTheme: theme });
    },
  };
});

// Helper to apply CSS variables
function applyThemeVariables(colors: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", colors.primary);
  root.style.setProperty("--color-secondary", colors.secondary);
  root.style.setProperty("--color-background", colors.background);
  root.style.setProperty("--color-card", colors.card);
  root.style.setProperty("--color-text-primary", colors.textPrimary);
  root.style.setProperty("--color-text-muted", colors.textMuted);
  root.style.setProperty("--color-success", colors.success);
  root.style.setProperty("--color-warning", colors.warning);
  root.style.setProperty("--color-danger", colors.danger);
  root.style.setProperty("--color-links", colors.links);
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
  );
  root.style.setProperty(
    "--gradient-secondary",
    `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`
  );
}
