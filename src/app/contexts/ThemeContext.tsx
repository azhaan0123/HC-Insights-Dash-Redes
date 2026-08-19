import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isHighContrast: boolean;
  setIsHighContrast: (value: boolean) => void;
  isLargeText: boolean;
  setIsLargeText: (value: boolean) => void;
  computedColors: {
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
    secondary: string;
    accentForeground: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const hexToRGB = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const mixWithWhite = (hex: string, percent: number) => {
  let { r, g, b } = hexToRGB(hex);
  r = Math.round(r + (255 - r) * (percent / 100));
  g = Math.round(g + (255 - g) * (percent / 100));
  b = Math.round(b + (255 - b) * (percent / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const mixWithBlack = (hex: string, percent: number) => {
  let { r, g, b } = hexToRGB(hex);
  r = Math.round(r * (1 - percent / 100));
  g = Math.round(g * (1 - percent / 100));
  b = Math.round(b * (1 - percent / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getContrastText = (hex: string) => {
  let { r, g, b } = hexToRGB(hex);
  let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState(() => {
    const hasReset = localStorage.getItem("hc-theme-reset-pink-v1");
    if (!hasReset) {
      localStorage.setItem("hc-theme-reset-pink-v1", "true");
      localStorage.setItem("hc-theme-color", "#e32168");
      return "#e32168";
    }
    return localStorage.getItem("hc-theme-color") || "#e32168";
  });

  const [isDarkMode, setIsDarkModeState] = useState(() => {
    return localStorage.getItem("hc-theme-dark") === "true";
  });

  const [isHighContrast, setIsHighContrastState] = useState(() => {
    return localStorage.getItem("hc-theme-contrast") === "true";
  });

  const [isLargeText, setIsLargeTextState] = useState(() => {
    return localStorage.getItem("hc-theme-large-text") === "true";
  });

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem("hc-theme-color", color);
  };

  const setIsDarkMode = (value: boolean) => {
    setIsDarkModeState(value);
    localStorage.setItem("hc-theme-dark", String(value));
  };

  const setIsHighContrast = (value: boolean) => {
    setIsHighContrastState(value);
    localStorage.setItem("hc-theme-contrast", String(value));
  };

  const setIsLargeText = (value: boolean) => {
    setIsLargeTextState(value);
    localStorage.setItem("hc-theme-large-text", String(value));
  };

  useEffect(() => {
    const root = document.documentElement;
    const style = root.style;
    const fg = getContrastText(primaryColor);
    
    // UI Colors (Hover states, backgrounds)
    // In dark mode, these need to be dark to match the dark background
    const uiVeryLight = isDarkMode ? mixWithBlack(primaryColor, 80) : mixWithWhite(primaryColor, 90);
    const uiLight = isDarkMode ? mixWithBlack(primaryColor, 50) : mixWithWhite(primaryColor, 20);
    const uiDark1 = isDarkMode ? mixWithWhite(primaryColor, 15) : mixWithBlack(primaryColor, 15);
    const uiDark3 = isDarkMode ? mixWithWhite(primaryColor, 40) : mixWithBlack(primaryColor, 50);

    // Chart Colors (Data visualization)
    // Reverting to the original vibrant scale for both light and dark modes
    const chart1 = mixWithWhite(primaryColor, 20);
    const chart2 = primaryColor;
    const chart3 = mixWithBlack(primaryColor, 15);
    const chart4 = mixWithBlack(primaryColor, 30);
    const chart5 = mixWithBlack(primaryColor, 50);

    // Core Colors
    style.setProperty("--primary", primaryColor);
    style.setProperty("--primary-foreground", fg);
    style.setProperty("--secondary", uiVeryLight);
    style.setProperty("--secondary-foreground", uiDark1);
    style.setProperty("--accent", uiVeryLight);
    style.setProperty("--accent-foreground", uiDark3);
    style.setProperty("--ring", uiLight);
    
    // Sidebar Colors
    style.setProperty("--sidebar-primary", primaryColor);
    style.setProperty("--sidebar-primary-foreground", fg);
    style.setProperty("--sidebar-accent", uiVeryLight);
    style.setProperty("--sidebar-accent-foreground", uiDark3);

    // Chart Palette (Monochromatic scale)
    style.setProperty("--chart-1", chart1);
    style.setProperty("--chart-2", chart2);
    style.setProperty("--chart-3", chart3);
    style.setProperty("--chart-4", chart4);
    style.setProperty("--chart-5", chart5);

    // Update global classes for accessibility options
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");

    if (isHighContrast) root.classList.add("high-contrast");
    else root.classList.remove("high-contrast");

    if (isLargeText) root.classList.add("large-text");
    else root.classList.remove("large-text");

  }, [primaryColor, isDarkMode, isHighContrast, isLargeText]);

  // Expose computed colors for JS usage if needed
  const computedColors = {
    chart1: mixWithWhite(primaryColor, 20),
    chart2: primaryColor,
    chart3: mixWithBlack(primaryColor, 15),
    chart4: mixWithBlack(primaryColor, 30),
    chart5: mixWithBlack(primaryColor, 50),
    secondary: isDarkMode ? mixWithBlack(primaryColor, 80) : mixWithWhite(primaryColor, 90),
    accentForeground: isDarkMode ? mixWithWhite(primaryColor, 40) : mixWithBlack(primaryColor, 50),
  };

  return (
    <ThemeContext.Provider value={{ 
      primaryColor, 
      setPrimaryColor, 
      computedColors,
      isDarkMode,
      setIsDarkMode,
      isHighContrast,
      setIsHighContrast,
      isLargeText,
      setIsLargeText
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
