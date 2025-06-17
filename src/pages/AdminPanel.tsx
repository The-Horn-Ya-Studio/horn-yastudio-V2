import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Member } from '../types';
import { v4 as uuidv4 } from 'uuid';
import darkTheme from '../theme/darkTheme';

const AdminPanel: React.FC = () => {
  const { state, dispatch, refreshData } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    bio: '',
    skills: '',
    avatar: null as File | null,
    twitter: '',
    facebook: '',
    github: '',
    discord: '',
    website: '',
    linkedin: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const processForm = async (avatarUrl: string) => {
      const memberData: Member = {
        id: editingMember?.id || uuidv4(),
        name: memberForm.name,
        role: memberForm.role,
        bio: memberForm.bio,
        avatar: avatarUrl,
        skills: memberForm.skills.split(',').map(s => s.trim()),
        joinDate: editingMember?.joinDate || new Date().toISOString(),
        socialLinks: {
          ...(memberForm.twitter && { twitter: memberForm.twitter }),
          ...(memberForm.facebook && { facebook: memberForm.facebook }),
          ...(memberForm.github && { github: memberForm.github }),
          ...(memberForm.discord && { discord: memberForm.discord }),
          ...(memberForm.website && { website: memberForm.website }),
          ...(memberForm.linkedin && { linkedin: memberForm.linkedin })
        }
      };

      if (editingMember) {
        await dispatch({ type: 'UPDATE_MEMBER', payload: memberData });
      } else {
        await dispatch({ type: 'ADD_MEMBER', payload: memberData });
      }
      if (refreshData) await refreshData();
      resetForm();
    };

    if (memberForm.avatar) {
      const reader = new FileReader();
      reader.onload = () => processForm(reader.result as string);
      reader.readAsDataURL(memberForm.avatar);
    } else {
      processForm(editingMember?.avatar || '');
    }
  };

  const resetForm = () => {
    setMemberForm({ 
      name: '', 
      role: '', 
      bio: '', 
      skills: '', 
      avatar: null,
      twitter: '',
      facebook: '',
      github: '',
      discord: '',
      website: '',
      linkedin: ''
    });
    setShowForm(false);
    setEditingMember(null);
  };

  const editMember = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      skills: member.skills.join(', '),
      avatar: null,
      twitter: member.socialLinks?.twitter || '',
      facebook: member.socialLinks?.facebook || '',
      github: member.socialLinks?.github || '',
      discord: member.socialLinks?.discord || '',
      website: member.socialLinks?.website || '',
      linkedin: member.socialLinks?.linkedin || ''
    });
    setShowForm(true);
  };

  const deleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      await dispatch({ type: 'DELETE_MEMBER', payload: id });
      if (refreshData) await refreshData();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1>Admin Panel</h1>
          <p style={subtitleStyle}>Manage members and content</p>
        </div>
        <div style={headerActionsStyle}>
          <button 
            onClick={() => navigate('/admin/gallery')}
            style={secondaryButtonStyle}
          >
            Manage Gallery
          </button>
          <button 
            onClick={handleLogout}
            style={logoutButtonStyle}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={adminNavStyle}>
        <div style={activeTabStyle}>Member Management</div>
      </div>

      <div style={actionBarStyle}>
        <h2>Manage Members</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={buttonStyle}
        >
          {showForm ? 'Cancel' : 'Add New Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
          
          <div style={formGridStyle}>
            <div style={formColumnStyle}>
              <h4 style={formSectionTitleStyle}>Basic Information</h4>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Role/Position</label>
                <input
                  type="text"
                  placeholder="Role/Position"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="Skills (comma separated)"
                  value={memberForm.skills}
                  onChange={(e) => setMemberForm({...memberForm, skills: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMemberForm({...memberForm, avatar: e.target.files?.[0] || null})}
                  style={fileInputStyle}
                />
                {editingMember && (
                  <p style={helperTextStyle}>Leave empty to keep current image</p>
                )}
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Bio/Description</label>
                <textarea
                  placeholder="Bio/Description"
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({...memberForm, bio: e.target.value})}
                  style={{...inputStyle, minHeight: '150px'}}
                  required
                />
              </div>
            </div>
            
            <div style={formColumnStyle}>
              <h4 style={formSectionTitleStyle}>Social Links</h4>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Twitter URL</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={memberForm.twitter}
                  onChange={(e) => setMemberForm({...memberForm, twitter: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/username"
                  value={memberForm.facebook}
                  onChange={(e) => setMemberForm({...memberForm, facebook: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={memberForm.github}
                  onChange={(e) => setMemberForm({...memberForm, github: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Discord URL</label>
                <input
                  type="url"
                  placeholder="https://discord.gg/invite"
                  value={memberForm.discord}
                  onChange={(e) => setMemberForm({...memberForm, discord: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={memberForm.linkedin}
                  onChange={(e) => setMemberForm({...memberForm, linkedin: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Personal Website</label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={memberForm.website}
                  onChange={(e) => setMemberForm({...memberForm, website: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
          
          <div style={formButtonsStyle}>
            <button type="submit" style={buttonStyle}>
              {editingMember ? 'Update' : 'Add'} Member
            </button>
            <button type="button" onClick={resetForm} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={membersListStyle}>
        <h3>Current Members ({state.members.length})</h3>
        {state.members.map(member => (
          <div key={member.id} style={memberItemStyle}>
            <img src={member.avatar} alt={member.name} style={memberAvatarStyle} />
            <div style={memberInfoStyle}>
              <div style={memberHeaderStyle}>
                <h4>{member.name}</h4>
                <span style={memberRoleBadgeStyle}>{member.role}</span>
              </div>
              <p style={memberBioStyle}>{member.bio}</p>
              <div style={skillsStyle}>
                {member.skills.map(skill => (
                  <span key={skill} style={skillTagStyle}>{skill}</span>
                ))}
              </div>
              
              {member.socialLinks && (
                <div style={socialLinksPreviewStyle}>
                  {Object.values(member.socialLinks).filter(Boolean).length > 0 && (
                    <span style={socialCountStyle}>
                      {Object.values(member.socialLinks).filter(Boolean).length} social links
                    </span>
                  )}
                </div>
              )}
            </div>
            <div style={actionsStyle}>
              <button onClick={() => editMember(member)} style={editButtonStyle}>
                Edit
              </button>
              <button onClick={() => deleteMember(member.id)} style={deleteButtonStyle}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1rem',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

const subtitleStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  marginTop: '0.5rem',
};

const headerActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};

const adminNavStyle: React.CSSProperties = {
  display: 'flex',
  borderBottom: `1px solid ${darkTheme.colors.border}`,
  marginBottom: '2rem',
};

const activeTabStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderBottom: `3px solid ${darkTheme.colors.primary}`,
  fontWeight: 600,
};

const actionBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.primary,
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: darkTheme.borderRadius.sm,
  cursor: 'pointer',
  fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.surface,
  color: darkTheme.colors.text.primary,
  border: `1px solid ${darkTheme.colors.border}`,
  padding: '0.75rem 1.5rem',
  borderRadius: darkTheme.borderRadius.sm,
  cursor: 'pointer',
  fontWeight: 600,
};

const logoutButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: darkTheme.colors.error,
  border: `1px solid ${darkTheme.colors.error}`,
  padding: '0.75rem 1.5rem',
  borderRadius: darkTheme.borderRadius.sm,
  cursor: 'pointer',
  fontWeight: 600,
};

const formStyle: React.CSSProperties = {
  background: darkTheme.gradients.darkGlass,
  padding: '2rem',
  borderRadius: darkTheme.borderRadius.md,
  marginBottom: '2rem',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  marginTop: '1.5rem',
};

const formColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const formSectionTitleStyle: React.CSSProperties = {
  color: darkTheme.colors.primary,
  marginBottom: '0.5rem',
  borderBottom: `1px solid ${darkTheme.colors.border}`,
  paddingBottom: '0.5rem',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '1rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  color: darkTheme.colors.text.secondary,
  fontSize: '0.9rem',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: 'rgba(10, 10, 10, 0.7)',
  border: `1px solid ${darkTheme.colors.border}`,
  borderRadius: darkTheme.borderRadius.sm,
  color: darkTheme.colors.text.primary,
  fontSize: '1rem',
};

const fileInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0',
  color: darkTheme.colors.text.secondary,
};

const helperTextStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: darkTheme.colors.text.secondary,
  marginTop: '0.25rem',
};

const formButtonsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem',
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.surface,
  color: darkTheme.colors.text.primary,
  border: `1px solid ${darkTheme.colors.border}`,
  padding: '0.75rem 1.5rem',
  borderRadius: darkTheme.borderRadius.sm,
  cursor: 'pointer',
};

const membersListStyle: React.CSSProperties = {
  marginTop: '2rem',
};

const memberItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '1.5rem',
  background: darkTheme.gradients.darkGlass,
  borderRadius: darkTheme.borderRadius.md,
  marginBottom: '1rem',
  gap: '1.5rem',
};

const memberAvatarStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `2px solid ${darkTheme.colors.border}`,
};

const memberInfoStyle: React.CSSProperties = {
  flex: 1,
};

const memberHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
  marginBottom: '0.5rem',
};

const memberRoleBadgeStyle: React.CSSProperties = {
  background: 'rgba(106, 90, 205, 0.15)',
  color: darkTheme.colors.primary,
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
};

const memberBioStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  marginBottom: '0.75rem',
};

const skillsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '0.75rem',
};

const skillTagStyle: React.CSSProperties = {
  background: darkTheme.colors.surface,
  color: darkTheme.colors.text.primary,
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.8rem',
  border: `1px solid ${darkTheme.colors.border}`,
};

const socialLinksPreviewStyle: React.CSSProperties = {
  marginTop: '0.5rem',
};

const socialCountStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: darkTheme.colors.accent,
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.accent,
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: darkTheme.borderRadius.sm,
  cursor: 'pointer',
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.error,
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: darkTheme.borderRadius.sm,
  cursor: 'pointer',
};

export default AdminPanel;
