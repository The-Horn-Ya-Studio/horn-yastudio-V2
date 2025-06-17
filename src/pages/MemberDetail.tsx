import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import darkTheme from '../theme/darkTheme';

// Social media icons using inline SVGs
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.608 1.2495-1.8447-.2762-3.6677-.2762-5.4878 0-.1634-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0738.0738 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const WebsiteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
  </svg>
);

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
                  <TwitterIcon />
                </a>
              )}
              
              {member.socialLinks.facebook && (
                <a 
                  href={member.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{...socialLinkStyle, backgroundColor: '#3B5998'}}
                  title="Facebook"
                >
                  <FacebookIcon />
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
                  <GitHubIcon />
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
                  <DiscordIcon />
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
                  <LinkedInIcon />
                </a>
              )}
              
              {member.socialLinks.website && (
                <a 
                  href={member.socialLinks.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{...socialLinkStyle, backgroundColor: '#4285F4'}}
                  title="Website"
                >
                  <WebsiteIcon />
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
