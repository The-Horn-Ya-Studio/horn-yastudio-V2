import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Photo } from '../types';
import { v4 as uuidv4 } from 'uuid';
import darkTheme from '../theme/darkTheme';

const AdminGallery: React.FC = () => {
  const { state, dispatch, refreshData } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    photographer: '',
    file: null as File | null
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const newPhoto: Photo = {
        id: uuidv4(),
        title: uploadForm.title,
        description: uploadForm.description,
        photographer: uploadForm.photographer,
        url: reader.result as string,
        uploadDate: new Date().toISOString()
      };
      
      await dispatch({ type: 'ADD_PHOTO', payload: newPhoto });
      if (refreshData) await refreshData();
      setUploadForm({ title: '', description: '', photographer: '', file: null });
      setShowUpload(false);
    };
    reader.readAsDataURL(uploadForm.file);
  };

  const deletePhoto = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      await dispatch({ type: 'DELETE_PHOTO', payload: id });
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
            onClick={() => navigate('/admin')}
            style={secondaryButtonStyle}
          >
            Manage Members
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
        <div style={activeTabStyle}>Gallery Management</div>
      </div>

      <div style={actionBarStyle}>
        <h2>Manage Gallery</h2>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          style={buttonStyle}
        >
          {showUpload ? 'Cancel' : 'Upload New Photo'}
        </button>
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} style={formStyle}>
          <h3>Upload New Photo</h3>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Photo Title</label>
            <input
              type="text"
              placeholder="Photo Title"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Description"
              value={uploadForm.description}
              onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              style={{...inputStyle, minHeight: '100px'}}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Photographer Name</label>
            <input
              type="text"
              placeholder="Photographer Name"
              value={uploadForm.photographer}
              onChange={(e) => setUploadForm({...uploadForm, photographer: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
              style={fileInputStyle}
              required
            />
          </div>
          
          <div style={formButtonsStyle}>
            <button type="submit" style={buttonStyle}>
              Upload Photo
            </button>
            <button 
              type="button" 
              onClick={() => setShowUpload(false)} 
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={galleryGridStyle}>
        {state.photos.length === 0 ? (
          <div style={emptyStateStyle}>
            <h3>No photos yet</h3>
            <p>Upload photos to showcase your community's work</p>
          </div>
        ) : (
          state.photos.map(photo => (
            <div key={photo.id} style={galleryItemStyle}>
              <div style={photoContainerStyle}>
                <img src={photo.url} alt={photo.title} style={photoImageStyle} />
                <button 
                  onClick={() => deletePhoto(photo.id)} 
                  style={deleteButtonSmallStyle}
                >
                  ×
                </button>
              </div>
              <div style={photoInfoStyle}>
                <h4>{photo.title}</h4>
                <p style={photoDescriptionStyle}>{photo.description}</p>
                <div style={photoMetaStyle}>
                  <span>By: {photo.photographer}</span>
                  <span>{new Date(photo.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
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

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
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

const formButtonsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: darkTheme.colors.surface,
  color: darkTheme.colors.text.primary,
  border: `1px solid ${darkTheme.colors.border}`,
  padding: '0.75rem 1.5rem',
  borderRadius: darkTheme.borderRadius.sm,
  cursor: 'pointer',
};

const galleryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1.5rem',
  marginTop: '2rem',
};

const emptyStateStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '3rem',
  color: darkTheme.colors.text.secondary,
  border: `1px dashed ${darkTheme.colors.border}`,
  borderRadius: darkTheme.borderRadius.md,
};

const galleryItemStyle: React.CSSProperties = {
  background: darkTheme.gradients.darkGlass,
  borderRadius: darkTheme.borderRadius.md,
  overflow: 'hidden',
};

const photoContainerStyle: React.CSSProperties = {
  position: 'relative',
  height: '200px',
  overflow: 'hidden',
};

const photoImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const deleteButtonSmallStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(207, 102, 121, 0.8)',
  color: 'white',
  border: 'none',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const photoInfoStyle: React.CSSProperties = {
  padding: '1rem',
};

const photoDescriptionStyle: React.CSSProperties = {
  color: darkTheme.colors.text.secondary,
  margin: '0.5rem 0',
  fontSize: '0.9rem',
};

const photoMetaStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  color: darkTheme.colors.text.secondary,
  fontSize: '0.8rem',
  marginTop: '0.5rem',
};

export default AdminGallery;
