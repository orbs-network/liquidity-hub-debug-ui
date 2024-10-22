import { extendTheme } from '@chakra-ui/react';
import '@fontsource-variable/open-sans'


export const theme = extendTheme({
  colors: {
    // Updated existing colors
    border: "#f8f8f9", // Darker border color
    secondaryText: "#2d2d2d", // Lighter secondary text for better contrast

    // Added new colors inspired by Arkham Explorer
    background: "#F7F8F9", // Dark background
    primary: "#4a4a4a", // Dark gray for primary elements
    accent: "#6b8e23", // Dark olive green for accents
    text: "#e0e0e0", // Light gray for main text
    highlight: "#8b0000", // Dark red for highlights or important elements
  },
  // Added new properties for a more complete theme
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  shadows: {
    default: "0 2px 4px rgba(0, 0, 0, 0.5)",
    intense: "0 4px 8px rgba(0, 0, 0, 0.7)",
  },
});
