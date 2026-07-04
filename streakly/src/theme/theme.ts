export const Theme = {
  colors: {
    background: "#F4F6F5",
    card: "#FFFFFF",
    glass: "rgba(255, 255, 255, 0.45)",
    glassBorder: "rgba(255, 255, 255, 0.6)",
    textPrimary: "#1A221E",
    textSecondary: "#5C6861",
    border: "#E4E9E6",
    
    // Brand Accent
    primary: "#3B8E63",
    primaryLight: "#EAF5EE",
    
    // Habit Category Colors
    categories: {
      water: {
        bg: "#E6F2FF",
        accent: "#1A80E6",
      },
      code: {
        bg: "#ECEBFF",
        accent: "#4F46E5",
      },
      read: {
        bg: "#FFF2E6",
        accent: "#EA580C",
      },
      workout: {
        bg: "#FFEBEB",
        accent: "#DC2626",
      },
      meditate: {
        bg: "#E6F7F5",
        accent: "#0D9488",
      },
      noSugar: {
        bg: "#FDF2E9",
        accent: "#D97706",
      },
    },
  },
  
  shadows: {
    soft: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 4,
    },
  },

  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    pill: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};
