import { configureFonts, MD3LightTheme } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'Poppins-Regular',
};

const fonts = configureFonts({
  config: {
    ...fontConfig,
  },
});

const theme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#850000', // Updated primary color
    primaryContainer: '#fdfffc', // Updated to match secondary/tertiary background
    secondary: '#fdfffc', // Updated secondary color
    secondaryContainer: '#850000', // Contrast for secondary
    tertiary: '#121113', // Updated tertiary color
    tertiaryContainer: '#850000', // Contrast for tertiary
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#B00020',
    errorContainer: '#FDEAEA',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#8B0000',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#B71C1C',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#D32F2F',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
    onError: '#FFFFFF',
    onErrorContainer: '#B00020',
    onBackground: '#1C1B1F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#FFB4AB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
};

export default theme;
