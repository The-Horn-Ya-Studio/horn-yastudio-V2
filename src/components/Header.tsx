import React from 'react';
import darkTheme from '../theme/darkTheme';

const Header: React.FC = () => {
  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={logoContainerStyle}>
          <h1 style={titleStyle}>
            The Horn-ya
            <br />
            Studio
          </h1>
        </div>
        <p style={subtitleStyle}>Where Anime Culture meets Community</p>
      </div>
      <div style={decorationStyle}></div>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  background: `linear-gradient(180deg, ${darkTheme.colors.surface} 0%, ${darkTheme.colors.background} 100%)`,
  padding: `${darkTheme.spacing.lg} 0`,
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
};

const logoContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: darkTheme.spacing.sm,
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '1.5rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  color: '#6A5ACD',
  textShadow: '0 0 5px rgba(106, 90, 205, 0.3)',
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  color: darkTheme.colors.text.secondary,
};

const decorationStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '5px',
  background: darkTheme.gradients.primary,
  boxShadow: '0 0 15px rgba(106, 90, 205, 0.8)',
};

export default Header;
