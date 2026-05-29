/**
 * Nord Color Palette
 * https://www.nordtheme.com/docs/colors-and-palettes
 */
export const Colors = {
  // Polar Night
  nord0: '#2E3440',
  nord1: '#3B4252',
  nord2: '#434C5E',
  nord3: '#4C566A',

  // Snow Storm
  nord4: '#D8DEE9',
  nord5: '#E5E9F0',
  nord6: '#ECEFF4',

  // Frost
  nord7: '#8FBCBB',
  nord8: '#88C0D0',
  nord9: '#81A1C1',
  nord10: '#5E81AC',

  // Aurora
  nord11: '#BF616A',
  nord12: '#D08770',
  nord13: '#EBCB8B',
  nord14: '#A3BE8C',
  nord15: '#B48EAD',
};

export const theme = {
  light: {
    background: Colors.nord6,
    surface: Colors.nord5,
    primary: Colors.nord10,
    secondary: Colors.nord9,
    text: Colors.nord0,
    textMuted: Colors.nord3,
    border: Colors.nord4,
    error: Colors.nord11,
    warning: Colors.nord13,
    success: Colors.nord14,
    favorite: Colors.nord14,
    accent: Colors.nord8,
    codeBackground: Colors.nord5, // Lighter for light mode
  },
  dark: {
    background: Colors.nord0,
    surface: Colors.nord1,
    primary: Colors.nord8,
    secondary: Colors.nord9,
    text: Colors.nord6,
    textMuted: Colors.nord4,
    border: Colors.nord2,
    error: Colors.nord11,
    warning: Colors.nord13,
    success: Colors.nord14,
    favorite: Colors.nord14,
    accent: Colors.nord7,
    codeBackground: '#242933', // Even darker for dark mode (Nord inspired)
  },
};
