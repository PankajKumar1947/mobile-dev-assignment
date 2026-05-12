export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  card: string;
  border: string;
  placeholder: string;
  error: string;
  success: string;
}

export const colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: '#F8F9FA',
    text: '#1A1A1A',
    primary: '#FF6B00',
    card: '#FFFFFF',
    border: '#E9ECEF',
    placeholder: '#ADB5BD',
    error: '#FA5252',
    success: '#40C057',
  },
  dark: {
    background: '#121214',
    text: '#F8F9FA',
    primary: '#FF6B00',
    card: '#1C1C1E',
    border: '#2C2C2E',
    placeholder: '#8E8E93',
    error: '#FF453A',
    success: '#32D74B',
  },
};
