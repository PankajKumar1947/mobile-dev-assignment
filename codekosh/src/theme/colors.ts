export const Colors = {
  // Backgrounds
  bg: '#1E1E1E',
  bgSecondary: '#252526',
  bgTertiary: '#2D2D30',

  // Borders
  border: '#3E3E42',

  // Text
  text: '#D4D4D4',
  textMuted: '#9DA1A6',
  textSubtle: '#6A737D',

  // VS Code Accents
  blue: '#007ACC',
  blueLight: '#4FC1FF',

  green: '#4EC9B0',
  orange: '#CE9178',
  yellow: '#DCDCAA',
  red: '#F14C4C',
  purple: '#C586C0',
  cyan: '#4EC9B0',
  pink: '#D16D9E',
};

export const theme = {
  light: {
    background: '#FFFFFF',
    surface: '#F3F3F3',
    primary: Colors.blue,
    secondary: Colors.purple,

    text: '#1F2328',
    textMuted: '#57606A',

    border: '#D0D7DE',

    success: '#2DA44E',
    warning: '#BF8700',
    error: '#CF222E',

    favorite: Colors.purple,
    accent: Colors.blueLight,

    codeBackground: '#F6F8FA',
  },

  dark: {
    background: Colors.bg,
    surface: Colors.bgSecondary,

    primary: Colors.blue,
    secondary: Colors.purple,

    text: Colors.text,
    textMuted: Colors.textMuted,

    border: Colors.border,

    success: Colors.green,
    warning: Colors.yellow,
    error: Colors.red,

    favorite: Colors.purple,
    accent: Colors.blueLight,

    codeBackground: '#181818',
  },
};