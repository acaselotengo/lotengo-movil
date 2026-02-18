/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // LO TENGO brand palette
        primary: {
          DEFAULT: "#ad3020", // ember
          light: "#ef741c",  // orange
          dark: "#9c2b1d",   // pressed
        },
        "primary-dark": "#9c2b1d",
        secondary: {
          DEFAULT: "#33559a", // ocean
          light: "#489dba",   // sky
          dark: "#2e4d8b",    // pressed
        },
        accent: {
          DEFAULT: "#ef741c", // orange (seller accent)
          light: "#f2a515",   // gold
          dark: "#e14924",    // sunset
        },
        lime: {
          DEFAULT: "#94cc1c",
        },
        surface: {
          DEFAULT: "#f7fafc",
          secondary: "#f7fafc",
          tertiary: "#edf0f7",
        },
        "bg-light": "#f7fafc",
        "bg-card": "#ffffff",
        "text-primary": "#15163e",
        "text-secondary": "#274178",
        "text-muted": "#8694b8",
        "border-light": "#dbe1ef",
        success: {
          DEFAULT: "#3a7558", // leaf
          light: "#d1fae5",
          dark: "#2d5a43",
        },
        danger: {
          DEFAULT: "#e14924", // sunset
          light: "#fee2e2",
          dark: "#ad3020",
        },
        warning: {
          DEFAULT: "#f2a515", // gold
          light: "#fef3c7",
          dark: "#d1a769",    // sand
        },
        info: {
          DEFAULT: "#489dba", // sky
          light: "#dbeafe",
        },
        // Auction states
        "bid-winning": "#94cc1c",
        "bid-outbid": "#e14924",
        "premium-badge": "#f2a515",
        "reserve-met": "#3a7558",
        "reserve-not-met": "#d1a769",
        // Brand raw palette (for gradients, etc.)
        brand: {
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
        },
      },
      borderRadius: {
        "3xl": "24px",
      },
      fontSize: {
        "2xs": "10px",
      },
    },
  },
  plugins: [],
};
