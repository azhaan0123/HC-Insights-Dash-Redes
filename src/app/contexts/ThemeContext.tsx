import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { 
  type IconVariant, 
  type IconSizePreset, 
  type IconColorMode, 
  IconVariantContext 
} from "../lib/icons";

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  iconVariant: IconVariant;
  setIconVariant: (variant: IconVariant) => void;
  iconSize: IconSizePreset;
  setIconSize: (size: IconSizePreset) => void;
  iconScale: number;
  setIconScale: (scale: number) => void;
  iconColorMode: IconColorMode;
  setIconColorMode: (mode: IconColorMode) => void;
  enableDuotoneMix: boolean;
  setEnableDuotoneMix: (enabled: boolean) => void;
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

  const SIZE_PRESETS: Record<IconSizePreset, number> = {
    sm: 0.85,
    md: 1.0,
    lg: 1.2,
    xl: 1.4,
  };

  const [iconVariant, setIconVariantState] = useState<IconVariant>(() => {
    const saved = localStorage.getItem("hc-theme-icon-variant") as IconVariant | null;
    const validVariants: IconVariant[] = ["TwoTone", "Outline", "Bold", "Bulk", "Broken", "Linear"];
    return saved && validVariants.includes(saved) ? saved : "TwoTone";
  });

  const [iconSize, setIconSizeState] = useState<IconSizePreset>(() => {
    const saved = localStorage.getItem("hc-theme-icon-size") as IconSizePreset | null;
    const validSizes: IconSizePreset[] = ["sm", "md", "lg", "xl"];
    return saved && validSizes.includes(saved) ? saved : "md";
  });

  const [iconScale, setIconScaleState] = useState<number>(() => {
    const saved = localStorage.getItem("hc-theme-icon-scale");
    const parsed = saved ? parseFloat(saved) : 1.0;
    return !isNaN(parsed) && parsed >= 0.6 && parsed <= 2.0 ? parsed : 1.0;
  });

  const [iconColorMode, setIconColorModeState] = useState<IconColorMode>(() => {
    const saved = localStorage.getItem("hc-theme-icon-color-mode") as IconColorMode | null;
    const validModes: IconColorMode[] = ["theme", "contextual", "monochrome"];
    return saved && validModes.includes(saved) ? saved : "theme";
  });

  const [enableDuotoneMix, setEnableDuotoneMixState] = useState<boolean>(() => {
    const saved = localStorage.getItem("hc-theme-icon-duotone-mix");
    return saved !== null ? saved === "true" : true;
  });

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem("hc-theme-color", color);
  };

  const setIconVariant = (variant: IconVariant) => {
    setIconVariantState(variant);
    localStorage.setItem("hc-theme-icon-variant", variant);
  };

  const setIconSize = (size: IconSizePreset) => {
    setIconSizeState(size);
    const newScale = SIZE_PRESETS[size] || 1.0;
    setIconScaleState(newScale);
    localStorage.setItem("hc-theme-icon-size", size);
    localStorage.setItem("hc-theme-icon-scale", String(newScale));
  };

  const setIconScale = (scale: number) => {
    const clamped = Math.max(0.7, Math.min(1.8, Number(scale.toFixed(2))));
    setIconScaleState(clamped);
    localStorage.setItem("hc-theme-icon-scale", String(clamped));
    // Find closest preset label if matches
    const matched = (Object.keys(SIZE_PRESETS) as IconSizePreset[]).find(
      (k) => Math.abs(SIZE_PRESETS[k] - clamped) < 0.05
    );
    if (matched) {
      setIconSizeState(matched);
      localStorage.setItem("hc-theme-icon-size", matched);
    }
  };

  const setIconColorMode = (mode: IconColorMode) => {
    setIconColorModeState(mode);
    localStorage.setItem("hc-theme-icon-color-mode", mode);
  };

  const setEnableDuotoneMix = (enabled: boolean) => {
    setEnableDuotoneMixState(enabled);
    localStorage.setItem("hc-theme-icon-duotone-mix", String(enabled));
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

    // Icon Palette & Duotone Mixing
    const iconPrimary = iconColorMode === "monochrome" 
      ? (isDarkMode ? "#ffffff" : "#171717") 
      : primaryColor;
    const iconSecondary = iconColorMode === "monochrome"
      ? (isDarkMode ? "#a3a3a3" : "#737373")
      : (isDarkMode ? mixWithWhite(primaryColor, 35) : mixWithBlack(primaryColor, 25));
    const iconSecondaryBg = iconColorMode === "monochrome"
      ? (isDarkMode ? "#262626" : "#e5e5e5")
      : (isDarkMode ? mixWithBlack(primaryColor, 40) : mixWithWhite(primaryColor, 75));

    style.setProperty("--icon-scale", String(iconScale));
    style.setProperty("--icon-primary", iconPrimary);
    style.setProperty("--icon-secondary", iconSecondary);
    style.setProperty("--icon-secondary-bg", iconSecondaryBg);

    // Update global classes for accessibility options
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");

    if (isHighContrast) root.classList.add("high-contrast");
    else root.classList.remove("high-contrast");

    if (isLargeText) root.classList.add("large-text");
    else root.classList.remove("large-text");

  }, [primaryColor, isDarkMode, isHighContrast, isLargeText, iconScale, iconColorMode, enableDuotoneMix]);

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
      iconVariant,
      setIconVariant,
      iconSize,
      setIconSize,
      iconScale,
      setIconScale,
      iconColorMode,
      setIconColorMode,
      enableDuotoneMix,
      setEnableDuotoneMix,
      computedColors,
      isDarkMode,
      setIsDarkMode,
      isHighContrast,
      setIsHighContrast,
      isLargeText,
      setIsLargeText
    }}>
      <IconVariantContext.Provider value={{ 
        variant: iconVariant, 
        setVariant: setIconVariant,
        size: iconSize,
        setSize: setIconSize,
        scale: iconScale,
        setScale: setIconScale,
        colorMode: iconColorMode,
        setColorMode: setIconColorMode,
        enableDuotoneMix,
        setEnableDuotoneMix
      }}>
        {children}
      </IconVariantContext.Provider>
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
