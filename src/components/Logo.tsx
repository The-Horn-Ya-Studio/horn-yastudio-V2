import React from 'react';
import darkTheme from '../theme/darkTheme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const fontSize = {
    small: '0.8rem',
    medium: '1.1rem',
    large: '1.5rem',
  }[size];

  const fontStyles: React.CSSProperties = {
    fontSize,
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: '#6A5ACD',
    textShadow: '0 0 5px rgba(106, 90, 205, 0.3)',
  };

  return (
    <div style={fontStyles}>
      {'The Horn-ya'}
      <br />
      {'Studio'}
    </div>
  );
};

export default Logo;
