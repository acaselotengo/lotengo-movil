/**
 * LO TENGO - Brand palette
 * Base colors extracted from the official logo.
 */
export const palette = {
  sunset: "#e14924",
  orange: "#ef741c",
  ember: "#ad3020",
  leaf: "#3a7558",
  green: "#549261",
  lime: "#94cc1c",
  sky: "#489dba",
  ocean: "#33559a",
  midnight: "#2a2c7c",
  gold: "#f2a515",
  sand: "#d1a769",

  white: "#ffffff",
  black: "#000000",
} as const;

/**
 * Auction-specific semantic colors.
 */
export const auctionColors = {
  bidWinning: palette.lime,
  bidOutbid: palette.sunset,
  countdown: {
    light: palette.orange,
    dark: palette.gold,
  },
  premiumBadge: palette.gold,
  reserveMet: palette.leaf,
  reserveNotMet: palette.sand,
} as const;
