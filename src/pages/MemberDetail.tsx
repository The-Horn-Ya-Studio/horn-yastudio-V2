import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import darkTheme from '../theme/darkTheme';

const MemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  
  const member = state.members.find(m => m.id === id);

  if (!member) {
    return (
      <div style={containerStyle}>
        <div style={notFoundStyle}>
          <h2>Member Not Found</h2>
          <p>The member you're looking for doesn't exist or has been removed.</p>
          <Link to="/members" style={linkButtonStyle}>Back to Members</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <button 
        onClick={() => navigate(-1)} 
        style={backButtonStyle}
      >
        ← Back
      </button>
      
      <div style={profileCardStyle}>
        <div style={profileHeaderStyle}>
          <img src={member.avatar} alt={member.name} style={avatarStyle} />
          <div>
            <h1 style={nameStyle}>{member.name}</h1>
            <p style={roleStyle}>{member.role}</p>
            <p style={joinDateStyle}>Member since {new Date(member.joinDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>About</h2>
          <p style={bioStyle}>{member.bio}</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Skills</h2>
          <div style={skillsContainerStyle}>
            {member.skills.map(skill => (
              <span key={skill} style={skillBadgeStyle}>{skill}</span>
            ))}
          </div>
        </div>

        {member.socialLinks && Object.values(member.socialLinks).some(link => link) && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Connect</h2>
            <div style={socialLinksStyle}>
              {member.socialLinks.twitter && (
                <a 
                  href={member.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{...socialLinkStyle, backgroundColor: '#1DA1F2'}}
                  title="Twitter"
                >
                  X
                </a>
              )}
              
              {member.socialLinks.github && (
                <a 
                  href={member.socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{...socialLinkStyle, backgroundColor: '#333'}}
                  title="GitHub"
                >
                  GH
                </a>
              )}
              
              {member.socialLinks.discord && (
                <a 
                  href={member.socialLinks.discord} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{...socialLinkStyle, backgroundColor: '#7289DA'}}
                  title="Discord"
                >
                  DC
                </a>
              )}
              
              {member.socialLinks.linkedin && (
                <a 
                  href={member.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{...socialLinkStyle, backgroundColor: '#0077B5'}}
                  title="LinkedIn"
                >
                  IN
                </a>
              )}
              
              {member.socialLinks.website && (
                <a 
                  href={member.socialLinks.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={socialLinkStyle}
                  title="Website"
                >
                  WEB
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '2rem 1rem',
};

const backButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: darkTheme.colors.text.secondary,
  backgroundColor: 'transparent',
  border: 'none',
  padding: '0.5rem 0',
  marginBottom: '1rem',
  cursor: 'pointer',
  fontSize: '1rem',
};

const profileCardStyle: React.CSSProperties = {
  background: darkTheme.gradients.darkGlass,
  borderRadius: darkTheme.borderRadius.lg,
  overflow: 'hidden',
  boxShadow: darkTheme.shadows.md,
  border: `1px solid ${darkTheme.colors.border}`,
};

const profileHeaderStyle: React.CSSProperties = {
  display: 'flex',
  padding: '2rem',
  background: darkTheme.gradients.darkAccent,
  gap: '2rem',
  alignItems: 'center',
};

const avatarStyle: React.CSSProperties = {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `4px solid ${darkTheme.colors.primary}`,
  boxShadow: '0 0 20px rgba(106, 90, 205, 0.4)',
};

const nameStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  margin: '0 0 0.5rem 0',
  color: darkTheme.colors.text.primary,
};

const roleStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  margin: '0 0 0.5rem 0',
  color: darkTheme.colors.primary,
  fontWeight: 600,
};

const joinDateStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: darkTheme.colors.text.secondary,
};

const sectionStyle: React.CSSProperties = {
  padding: '1.5rem 2rem',
  borderTop: `1px solid ${darkTheme.colors.border}`,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  marginBottom: '1rem',
  color: darkTheme.colors.text.primary,
};

const bioStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  lineHeight: '1.6',
  color: darkTheme.colors.text.secondary,
};

const skillsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const skillBadgeStyle: React.CSSProperties = {
  background: darkTheme.gradients.darkMetal,
  border: `1px solid ${darkTheme.colors.primary}`,
  color: darkTheme.colors.text.primary,
  padding: '0.4rem 0.8rem',
  borderRadius: '999px',
  fontSize: '0.9rem',
};

const socialLinksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
};

const socialLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  background: darkTheme.colors.surfaceAlt,
  color: 'white',
  transition: darkTheme.transitions.default,
  fontWeight: 'bold',
  fontSize: '0.8rem',
  textDecoration: 'none',
};

const notFoundStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '3rem 1rem',
  color: darkTheme.colors.text.secondary,
};

const linkButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  background: darkTheme.gradients.primary,
  color: 'white',
  borderRadius: darkTheme.borderRadius.sm,
  textDecoration: 'none',
};

export default MemberDetail;
