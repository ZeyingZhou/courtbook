const tintColorLight = '#000';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    foreground: "#000000",
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primaryButton: "#000000",
    primaryButtonText: "#FFFFFF",
    primaryButtonBorder: "#000000",

    secondaryButton: "transparent",
    secondaryButtonText: "#000000",
    secondaryButtonBorder: "#EDEDED",
    border: "#E8E8E8",
  },
  dark: {
    text: '#fff',
    background: '#000',
    foreground: "#FAFAFA",
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,

    primaryButton: "#FFFFFF",
    primaryButtonText: "#000000",
    primaryButtonBorder: "#FFFFFF",

    secondaryButton: "transparent",
    secondaryButtonText: "#FAFAFA",
    secondaryButtonBorder: "#2E2E2E",

    border: "#2E2E2E",
  },
};
