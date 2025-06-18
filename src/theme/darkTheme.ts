const darkTheme = {
  colors: {
    background: '#11111B', // Crust
    surface: '#1E1E2E',    // Base
    surfaceAlt: '#181825', // Mantle
    primary: '#B4BEFE',    // Lavender
    secondary: '#F5C2E7',  // Pink
    accent: '#89B4FA',     // Blue
    text: {
      primary: '#CDD6F4',  // Text
      secondary: '#BAC2DE', // Subtext
      accent: '#B4BEFE',   // Lavender
    },
    border: '#313244',     // Surface
    error: '#F38BA8',      // Red
    success: '#A6E3A1',    // Green
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    pill: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  },
  typography: {
    fontFamily: "'Exo 2', 'Roboto', sans-serif", // Futuristic font that works for both tech and anime themes
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #B4BEFE 0%, #89B4FA 100%)', // Lavender to Blue
    secondary: 'linear-gradient(135deg, #F5C2E7 0%, #B4BEFE 100%)', // Pink to Lavender
    accent: 'linear-gradient(135deg, #89B4FA 0%, #89DCEB 100%)', // Blue to Sky
    darkGlass: 'linear-gradient(180deg, rgba(30, 30, 46, 0.95) 0%, rgba(17, 17, 27, 0.98) 100%)', // Base to Crust
    darkMetal: 'linear-gradient(135deg, #181825 0%, #11111B 100%)', // Mantle to Crust
    darkShine: 'linear-gradient(180deg, #181825 0%, #11111B 50%, #1E1E2E 100%)', // Mantle, Crust, Base
    darkAccent: 'linear-gradient(135deg, #11111B 0%, #181825 90%, #B4BEFE 100%)', // Crust, Mantle, Lavender
    darkGlow: 'radial-gradient(circle at center, rgba(180, 190, 254, 0.15) 0%, rgba(17, 17, 27, 0) 70%)', // Lavender glow
  },
};

export default darkTheme;
