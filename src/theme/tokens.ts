import { palette, auctionColors } from "./colors";

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
} as const;

const typography = {
  sizes: {
    "2xs": 10,
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
} as const;

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface AppTheme {
  dark: boolean;
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    primaryPressed: string;
    primaryText: string;
    secondary: string;
    secondaryPressed: string;
    secondaryText: string;
    accent: string;
    accentText: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    card: string;
    bidWinning: string;
    bidOutbid: string;
    countdown: string;
    premiumBadge: string;
    reserveMet: string;
    reserveNotMet: string;
  };
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
}

export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    bg: "#ffffff",
    surface: "#f7fafc",
    surface2: "#edf0f7",
    text: "#15163e",
    textMuted: "#274178",
    border: "#dbe1ef",
    primary: palette.ember,
    primaryPressed: "#9c2b1d",
    primaryText: "#ffffff",
    secondary: palette.ocean,
    secondaryPressed: "#2e4d8b",
    secondaryText: "#ffffff",
    accent: palette.lime,
    accentText: "#15163e",
    success: palette.leaf,
    warning: palette.gold,
    danger: palette.sunset,
    info: palette.sky,
    card: "#ffffff",
    bidWinning: auctionColors.bidWinning,
    bidOutbid: auctionColors.bidOutbid,
    countdown: auctionColors.countdown.light,
    premiumBadge: auctionColors.premiumBadge,
    reserveMet: auctionColors.reserveMet,
    reserveNotMet: auctionColors.reserveNotMet,
  },
  spacing,
  radius,
  typography,
  shadows: {
    sm: {
      shadowColor: palette.midnight,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: palette.midnight,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: palette.midnight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 5,
    },
  },
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    bg: "#0b0f14",
    surface: "#15163e",
    surface2: "#1b1d51",
    text: "#edf0f7",
    textMuted: "#b8c3df",
    border: "#274178",
    primary: palette.orange,
    primaryPressed: palette.sunset,
    primaryText: "#0b0f14",
    secondary: palette.sky,
    secondaryPressed: "#418da7",
    secondaryText: "#0b0f14",
    accent: palette.lime,
    accentText: "#15163e",
    success: palette.leaf,
    warning: palette.gold,
    danger: palette.sunset,
    info: palette.sky,
    card: "#15163e",
    bidWinning: auctionColors.bidWinning,
    bidOutbid: auctionColors.bidOutbid,
    countdown: auctionColors.countdown.dark,
    premiumBadge: auctionColors.premiumBadge,
    reserveMet: auctionColors.reserveMet,
    reserveNotMet: auctionColors.reserveNotMet,
  },
  spacing,
  radius,
  typography,
  shadows: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 5,
    },
  },
};
