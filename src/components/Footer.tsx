import React from 'react';
import darkTheme from '../theme/darkTheme';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={topRowStyle}>
          <div style={columnStyle}>
            <div style={headingLogoStyle}>
              <div style={footerLogoStyle}>
                The Horn-ya
                <br />
                Studio
              </div>
            </div>
            <p style={textStyle}>
              A community for technology enthusiasts who are also anime fans.
              Sharing creativity, ideas, and culture in one unique space!
            </p>
          </div>
          
          <div style={columnStyle}>
            <h3 style={headingStyle}>Quick Links</h3>
            <ul style={listStyle}>
              <li><a href="/" style={linkStyle}>Home</a></li>
              <li><a href="/members" style={linkStyle}>Members</a></li>
              <li><a href="/gallery" style={linkStyle}>Gallery</a></li>
            </ul>
          </div>
          
          <div style={columnStyle}>
            <h3 style={headingStyle}>Connect With Us</h3>
            <ul style={listStyle}>
              <li><a href="https://discord.gg" target="_blank" rel="noreferrer" style={linkStyle}>Discord</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" style={linkStyle}>GitHub</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" style={linkStyle}>Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div style={dividerStyle}></div>
        
        <div style={copyrightStyle}>
          <p>© 2025 Horn-ya Studio. All rights reserved.</p>
          <p>Made with 💻 and ❤️ by the community</p>
        </div>
      </div>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  background: darkTheme.colors.surface,
  borderTop: `1px solid ${darkTheme.colors.border}`,
  padding: `${darkTheme.spacing.xl} 0`,
  marginTop: darkTheme.spacing.xxl,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
};

const topRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: darkTheme.spacing.xl,
};

const columnStyle: React.CSSProperties = {
  flex: '1 1 250px',
};

const headingStyle: React.CSSProperties = {
  fontSize: darkTheme.typography.h3.fontSize,
  fontWeight: darkTheme.typography.h3.fontWeight,
  marginBottom: darkTheme.spacing.md,
  background: darkTheme.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const textStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  lineHeight: '1.6',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
};

const linkStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  textDecoration: 'none',
  display: 'block',
  padding: `${darkTheme.spacing.xs} 0`,
  transition: darkTheme.transitions.default,
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  background: darkTheme.colors.border,
  margin: `${darkTheme.spacing.xl} 0`,
};

const copyrightStyle: React.CSSProperties = {
  textAlign: 'center',
  color: darkTheme.colors.text.secondary,
  fontSize: darkTheme.typography.small.fontSize,
};

const headingLogoStyle: React.CSSProperties = {
  marginBottom: darkTheme.spacing.md,
};

const footerLogoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  color: '#6A5ACD',
  textShadow: '0 0 5px rgba(106, 90, 205, 0.3)',
};

export default Footer;
