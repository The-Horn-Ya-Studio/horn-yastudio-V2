import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import darkTheme from '../theme/darkTheme';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { state } = useAuth();
  const isAdmin = state.isAuthenticated && state.user?.isAdmin;

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav style={{
      ...navStyle,
      background: scrolled ? darkTheme.colors.surface : 'transparent',
      boxShadow: scrolled ? darkTheme.shadows.md : 'none',
    }}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          <Logo size="small" />
        </Link>
        <div style={linksStyle}>
          <Link 
            to="/" 
            style={linkStyle}
            onMouseEnter={() => setHoveredLink('home')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Home
            <div style={{
              ...linkUnderlineStyle,
              width: hoveredLink === 'home' ? '100%' : '0%'
            }}></div>
          </Link>
          <Link 
            to="/members" 
            style={linkStyle}
            onMouseEnter={() => setHoveredLink('members')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Members
            <div style={{
              ...linkUnderlineStyle,
              width: hoveredLink === 'members' ? '100%' : '0%'
            }}></div>
          </Link>
          <Link 
            to="/gallery" 
            style={linkStyle}
            onMouseEnter={() => setHoveredLink('gallery')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Gallery
            <div style={{
              ...linkUnderlineStyle,
              width: hoveredLink === 'gallery' ? '100%' : '0%'
            }}></div>
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              style={linkStyle}
              onMouseEnter={() => setHoveredLink('admin')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Admin
              <div style={{
                ...linkUnderlineStyle,
                width: hoveredLink === 'admin' ? '100%' : '0%'
              }}></div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  padding: '1rem 0',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  transition: 'all 0.3s ease',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 1rem',
};

const logoStyle: React.CSSProperties = {
  color: darkTheme.colors.text.primary,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
};

const linksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2rem',
};

const linkStyle: React.CSSProperties = {
  color: darkTheme.colors.text.primary,
  textDecoration: 'none',
  position: 'relative',
  padding: '0.5rem 0',
  transition: 'color 0.3s ease',
  fontWeight: 500,
};

const linkUnderlineStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: '0',
  width: '0%',
  height: '2px',
  background: darkTheme.gradients.secondary,
  transition: 'width 0.3s ease',
};

export default Navbar;
