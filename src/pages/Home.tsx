import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import darkTheme from '../theme/darkTheme';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const { state } = useApp();

  return (
    <div style={containerStyle}>
      <section style={heroStyle}>
        <div style={heroContentStyle}>
          <div style={heroLogoContainerStyle}>
            <h1 style={heroTitle}>
              The Horn-ya
              <br />
              Studio
            </h1>
          </div>
          <p style={heroSubtitleStyle}>
            Where Creativity Meets Community and Talents Unite!
          </p>
          <div style={heroButtonsStyle}>
            <Link to="/members" style={primaryButtonStyle}>
              Meet Our Members
            </Link>
            <Link to="/gallery" style={secondaryButtonStyle}>
              View Gallery
            </Link>
          </div>
        </div>
        <div style={heroDecorStyle}></div>
      </section>

      <section style={featuredStyle}>
        <h2 style={sectionTitleStyle}>Community Highlights</h2>
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>{state.members.length}</span>
            <p style={statLabelStyle}>Creative Members</p>
          </div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>{state.photos.length}</span>
            <p style={statLabelStyle}>Shared Content</p>
          </div>
          <div style={statItemStyle}>
            <span style={statNumberStyle}>10+</span>
            <p style={statLabelStyle}>Skill Areas</p>
          </div>
        </div>
      </section>

      <section style={featuredMembersStyle}>
        <h2 style={sectionTitleStyle}>Featured Members</h2>
        <div style={membersGridStyle}>
          {state.members.slice(0, 3).map(member => (
            <div key={member.id} style={memberCardStyle} className="card">
              <img src={member.avatar} alt={member.name} style={avatarStyle} />
              <div style={memberInfoStyle}>
                <h3 style={memberNameStyle}>{member.name}</h3>
                <p style={memberRoleStyle}>{member.role}</p>
                <div style={skillsContainerStyle}>
                  {member.skills.slice(0, 3).map(skill => (
                    <span key={skill} style={skillTagStyle}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {state.members.length === 0 && (
            <div style={emptyStateStyle}>
              <p>No members yet. Be the first to join!</p>
              <Link to="/admin" style={emptyStateButtonStyle}>
                Add Members
              </Link>
            </div>
          )}
        </div>
        {state.members.length > 0 && (
          <div style={viewAllStyle}>
            <Link to="/members" style={viewAllLinkStyle}>
              View All Members
              <span style={arrowStyle}>→</span>
            </Link>
          </div>
        )}
      </section>

      <section style={featuresStyle}>
        <h2 style={sectionTitleStyle}>What We're About</h2>
        <div style={featuresGridStyle}>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Technology</h3>
            <p style={featureDescStyle}>
              Exploring various technologies and digital tools in creative ways, from coding to digital art.
            </p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Creativity</h3>
            <p style={featureDescStyle}>
              Sharing ideas, artwork, and projects that showcase our community's talents and interests.
            </p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Learning Together</h3>
            <p style={featureDescStyle}>
              Growing our skills through collaboration, workshops, and knowledge sharing among members.
            </p>
          </div>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Anime Culture</h3>
            <p style={featureDescStyle}>
              Celebrating Japanese animation, manga, and culture alongside our creative and technical interests.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
};

const heroStyle: React.CSSProperties = {
  position: 'relative',
  padding: `${darkTheme.spacing.xxl} 0`,
  textAlign: 'center',
  overflow: 'hidden',
};

const heroContentStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
};

const heroLogoContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: darkTheme.spacing.md,
};

const heroTitle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '2.5rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  color: '#6A5ACD',
  textShadow: '0 0 8px rgba(106, 90, 205, 0.4)',
  margin: 0,
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  marginBottom: darkTheme.spacing.lg,
  color: darkTheme.colors.text.secondary,
  maxWidth: '700px',
  margin: '0 auto',
};

const heroButtonsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: darkTheme.spacing.md,
  marginTop: darkTheme.spacing.lg,
};

const primaryButtonStyle: React.CSSProperties = {
  background: darkTheme.gradients.primary,
  color: 'white',
  padding: `${darkTheme.spacing.sm} ${darkTheme.spacing.lg}`,
  borderRadius: darkTheme.borderRadius.md,
  textDecoration: 'none',
  fontWeight: 600,
  transition: darkTheme.transitions.default,
  boxShadow: `0 4px 14px rgba(106, 90, 205, 0.4)`,
};

const secondaryButtonStyle: React.CSSProperties = {
  background: 'transparent',
  color: darkTheme.colors.text.primary,
  padding: `${darkTheme.spacing.sm} ${darkTheme.spacing.lg}`,
  borderRadius: darkTheme.borderRadius.md,
  textDecoration: 'none',
  fontWeight: 600,
  transition: darkTheme.transitions.default,
  border: `2px solid ${darkTheme.colors.border}`,
};

const heroDecorStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20%',
  right: '-5%',
  width: '350px',
  height: '350px',
  borderRadius: '50%',
  background: `radial-gradient(circle, rgba(106, 90, 205, 0.1) 0%, rgba(106, 90, 205, 0) 70%)`,
  zIndex: 1,
};

const featuredStyle: React.CSSProperties = {
  padding: `${darkTheme.spacing.xl} 0`,
  textAlign: 'center',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: darkTheme.typography.h2.fontSize,
  fontWeight: darkTheme.typography.h2.fontWeight,
  marginBottom: darkTheme.spacing.xl,
  position: 'relative',
  display: 'inline-block',
  color: darkTheme.colors.text.primary,
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '4rem',
  marginBottom: darkTheme.spacing.xl,
};

const statItemStyle: React.CSSProperties = {
  textAlign: 'center',
};

const statNumberStyle: React.CSSProperties = {
  fontSize: '3rem',
  fontWeight: 'bold',
  display: 'block',
  background: darkTheme.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const statLabelStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  fontSize: '1.1rem',
};

const featuredMembersStyle: React.CSSProperties = {
  padding: `${darkTheme.spacing.xl} 0`,
};

const membersGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: darkTheme.spacing.lg,
  marginTop: darkTheme.spacing.lg,
};

const memberCardStyle: React.CSSProperties = {
  background: darkTheme.colors.surface,
  borderRadius: darkTheme.borderRadius.md,
  overflow: 'hidden',
  border: `1px solid ${darkTheme.colors.border}`,
  transition: darkTheme.transitions.default,
};

const avatarStyle: React.CSSProperties = {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
};

const memberInfoStyle: React.CSSProperties = {
  padding: darkTheme.spacing.md,
};

const memberNameStyle: React.CSSProperties = {
  marginBottom: darkTheme.spacing.xs,
  color: darkTheme.colors.text.primary,
};

const memberRoleStyle: React.CSSProperties = {
  color: darkTheme.colors.primary,
  marginBottom: darkTheme.spacing.md,
  fontSize: '0.9rem',
};

const skillsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: darkTheme.spacing.xs,
};

const skillTagStyle: React.CSSProperties = {
  background: 'rgba(106, 90, 205, 0.1)',
  color: darkTheme.colors.primary,
  padding: `${darkTheme.spacing.xs} ${darkTheme.spacing.sm}`,
  borderRadius: darkTheme.borderRadius.pill,
  fontSize: '0.75rem',
};

const viewAllStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: darkTheme.spacing.xl,
};

const viewAllLinkStyle: React.CSSProperties = {
  color: darkTheme.colors.primary,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 600,
};

const arrowStyle: React.CSSProperties = {
  marginLeft: darkTheme.spacing.xs,
  transition: darkTheme.transitions.default,
};

const emptyStateStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: darkTheme.spacing.xl,
  color: darkTheme.colors.text.secondary,
  border: `1px dashed ${darkTheme.colors.border}`,
  borderRadius: darkTheme.borderRadius.md,
};

const emptyStateButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: darkTheme.spacing.md,
  padding: `${darkTheme.spacing.sm} ${darkTheme.spacing.md}`,
  background: darkTheme.colors.primary,
  color: 'white',
  borderRadius: darkTheme.borderRadius.sm,
  textDecoration: 'none',
};

const featuresStyle: React.CSSProperties = {
  padding: `${darkTheme.spacing.xxl} 0`,
};

const featuresGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: darkTheme.spacing.lg,
};

const featureCardStyle: React.CSSProperties = {
  background: darkTheme.colors.surface,
  padding: darkTheme.spacing.lg,
  borderRadius: darkTheme.borderRadius.md,
  border: `1px solid ${darkTheme.colors.border}`,
  borderLeft: `3px solid ${darkTheme.colors.primary}`,
};

const featureTitleStyle: React.CSSProperties = {
  marginBottom: darkTheme.spacing.md,
  color: darkTheme.colors.text.primary,
};

const featureDescStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  lineHeight: '1.6',
};

export default Home;
