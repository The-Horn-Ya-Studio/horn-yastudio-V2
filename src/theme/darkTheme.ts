const darkTheme = {
  colors: {
    background: '#0A0A0A',
    surface: '#121212',
    surfaceAlt: '#1A1A1A',
    primary: '#6A5ACD', // Slate blue - anime-inspired
    secondary: '#FF4081', // Pink - anime-inspired
    accent: '#00B0FF', // Cyan - tech-inspired
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      accent: '#6A5ACD',
    },
    border: '#333333',
    error: '#CF6679',
    success: '#03DAC5',
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
  // Enhanced gradients with more black
  gradients: {
    primary: 'linear-gradient(135deg, #6A5ACD 0%, #00B0FF 100%)',
    secondary: 'linear-gradient(135deg, #FF4081 0%, #6A5ACD 100%)',
    accent: 'linear-gradient(135deg, #00B0FF 0%, #00BFA5 100%)',
    darkGlass: 'linear-gradient(180deg, rgba(18, 18, 18, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
    darkMetal: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
    darkShine: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 50%, #121212 100%)',
    darkAccent: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 90%, #6A5ACD 100%)',
    darkGlow: 'radial-gradient(circle at center, rgba(106, 90, 205, 0.15) 0%, rgba(10, 10, 10, 0) 70%)',
  },
};

export default darkTheme;
