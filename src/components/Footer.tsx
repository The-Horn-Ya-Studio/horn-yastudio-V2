import React from 'react';
import darkTheme from '../theme/darkTheme';

// Social media icons using inline SVGs for better performance
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const LinkTreeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-6 17c1.513-6.587 7-7.778 7-7.778v-2.222l5 4.425-5 4.464v-2.223c0 .001-3.78-.114-7 3.334z"/>
  </svg>
);

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
            <div style={socialLinksContainerStyle}>
              <a 
                href="https://github.com/The-Horn-Ya-Studio" 
                target="_blank" 
                rel="noreferrer" 
                style={socialLinkStyle}
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a 
                href="https://www.instagram.com/thehorn_yastudio/" 
                target="_blank" 
                rel="noreferrer" 
                style={{...socialLinkStyle, backgroundColor: '#E1306C'}}
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://facebook.com/HornyaStudio/" 
                target="_blank" 
                rel="noreferrer" 
                style={{...socialLinkStyle, backgroundColor: '#3B5998'}}
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://linktr.ee/TheHorn_yaStudio" 
                target="_blank" 
                rel="noreferrer" 
                style={{...socialLinkStyle, backgroundColor: '#39E09B'}}
                aria-label="Linktree"
              >
                <LinkTreeIcon />
              </a>
            </div>
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

const socialLinksContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  marginTop: '0.5rem',
};

const socialLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#333',
  color: 'white',
  transition: darkTheme.transitions.default,
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
