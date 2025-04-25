// src/theme/theme.ts
import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

// Define custom fonts
const fontConfig = {
  fontFamily: 'System',
};

// Define custom colors inspired by Apple and IBM design systems
const colors = {
  primary: '#0066CC', // IBM Blue
  secondary: '#4D88FF', // Lighter blue
  tertiary: '#34C759', // Apple green
  error: '#FF3B30', // Apple red
  background: '#F5F5F7', // Apple light background
  surface: '#FFFFFF',
  accent: '#5E5CE6', // Apple purple
  onSurface: '#000000',
  text: '#000000',
  disabled: '#C7C7CC',
  placeholder: '#8E8E93',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#FF3B30',
};

// Create custom theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
};

// Create navigation theme
export const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.primary,
    text: '#FFFFFF',
    border: 'transparent',
  },
};
