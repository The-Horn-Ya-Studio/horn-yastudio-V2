import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import darkTheme from '../theme/darkTheme';

const MembersPage: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="container">
      <header style={headerStyle}>
        <h1 style={titleStyle}>Our Community Members</h1>
        <p style={subtitleStyle}>Meet the tech enthusiasts and anime lovers who make up our community</p>
      </header>

      <div style={statsStyle}>
        <div style={statItemStyle}>
          <span style={statNumberStyle}>{state.members.length}</span>
          <span style={statLabelStyle}>Community Members</span>
        </div>
        <div style={statItemStyle}>
          <span style={statNumberStyle}>{state.photos.length}</span>
          <span style={statLabelStyle}>Shared Photos</span>
        </div>
      </div>

      {state.members.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3>No members yet</h3>
          <p>Be the first to join our tech-anime community!</p>
        </div>
      ) : (
        <div style={membersGridStyle}>
          {state.members.map(member => (
            <Link 
              to={`/members/${member.id}`} 
              key={member.id} 
              style={memberCardLinkStyle}
            >
              <div style={memberCardStyle} className="card">
                <div style={memberImageContainerStyle}>
                  <img src={member.avatar} alt={member.name} style={avatarStyle} />
                  <div style={memberOverlayStyle}>
                    <div style={memberRoleStyle}>{member.role}</div>
                  </div>
                </div>
                <div style={memberInfoStyle}>
                  <h3 style={memberNameStyle}>{member.name}</h3>
                  <p style={memberBioStyle}>
                    {member.bio.length > 100 
                      ? `${member.bio.substring(0, 100)}...` 
                      : member.bio}
                  </p>
                  <div style={memberSkillsStyle}>
                    {member.skills.slice(0, 3).map(skill => (
                      <span key={skill} style={skillBadgeStyle}>{skill}</span>
                    ))}
                    {member.skills.length > 3 && (
                      <span style={moreSkillsStyle}>+{member.skills.length - 3}</span>
                    )}
                  </div>
                  <div style={viewProfileStyle}>View Profile →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: darkTheme.spacing.xl,
};

const titleStyle: React.CSSProperties = {
  fontSize: darkTheme.typography.h1.fontSize,
  fontWeight: darkTheme.typography.h1.fontWeight,
  marginBottom: darkTheme.spacing.sm,
  color: darkTheme.colors.text.primary,
};

const subtitleStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  fontSize: '1.1rem',
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '4rem',
  marginBottom: darkTheme.spacing.xl,
};

const statItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const statNumberStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  background: darkTheme.gradients.primary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const statLabelStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: darkTheme.spacing.xl,
  color: darkTheme.colors.text.secondary,
};

const membersGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: darkTheme.spacing.lg,
};

const memberCardStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.surface,
  overflow: 'hidden',
  borderRadius: darkTheme.borderRadius.md,
  border: `1px solid ${darkTheme.colors.border}`,
};

const memberImageContainerStyle: React.CSSProperties = {
  position: 'relative',
  height: '200px',
  overflow: 'hidden',
};

const avatarStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const memberOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: darkTheme.spacing.sm,
};

const memberRoleStyle: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(0,0,0,0.7)',
  color: darkTheme.colors.primary,
  padding: `${darkTheme.spacing.xs} ${darkTheme.spacing.sm}`,
  borderRadius: darkTheme.borderRadius.sm,
  fontSize: '0.8rem',
  fontWeight: 'bold',
};

const memberInfoStyle: React.CSSProperties = {
  padding: darkTheme.spacing.md,
};

const memberNameStyle: React.CSSProperties = {
  marginBottom: darkTheme.spacing.sm,
  color: darkTheme.colors.text.primary,
};

const memberBioStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  marginBottom: darkTheme.spacing.md,
  fontSize: '0.9rem',
};

const memberSkillsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: darkTheme.spacing.xs,
};

const skillBadgeStyle: React.CSSProperties = {
  background: darkTheme.colors.surface,
  border: `1px solid ${darkTheme.colors.primary}`,
  color: darkTheme.colors.primary,
  padding: `${darkTheme.spacing.xs} ${darkTheme.spacing.sm}`,
  borderRadius: darkTheme.borderRadius.pill,
  fontSize: '0.8rem',
};

const memberCardLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: darkTheme.colors.text.primary,
  display: 'block',
};

const moreSkillsStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.surfaceAlt,
  color: darkTheme.colors.text.secondary,
  padding: `${darkTheme.spacing.xs} ${darkTheme.spacing.sm}`,
  borderRadius: darkTheme.borderRadius.pill,
  fontSize: '0.8rem',
};

const viewProfileStyle: React.CSSProperties = {
  marginTop: darkTheme.spacing.md,
  color: darkTheme.colors.primary,
  fontSize: '0.9rem',
  fontWeight: 500,
};

export default MembersPage;
