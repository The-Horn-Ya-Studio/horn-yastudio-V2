import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Photo } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Gallery: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    photographer: '',
    file: null as File | null
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newPhoto: Photo = {
        id: uuidv4(),
        title: uploadForm.title,
        description: uploadForm.description,
        photographer: uploadForm.photographer,
        url: reader.result as string,
        uploadDate: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_PHOTO', payload: newPhoto });
      setUploadForm({ title: '', description: '', photographer: '', file: null });
      setShowUpload(false);
    };
    reader.readAsDataURL(uploadForm.file);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Photo Gallery</h1>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          style={buttonStyle}
        >
          {showUpload ? 'Cancel' : 'Upload Photo'}
        </button>
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} style={formStyle}>
          <input
            type="text"
            placeholder="Photo Title"
            value={uploadForm.title}
            onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={uploadForm.description}
            onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Photographer Name"
            value={uploadForm.photographer}
            onChange={(e) => setUploadForm({...uploadForm, photographer: e.target.value})}
            style={inputStyle}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>Upload</button>
        </form>
      )}

      <div style={galleryStyle}>
        {state.photos.map(photo => (
          <div key={photo.id} style={photoCardStyle}>
            <img src={photo.url} alt={photo.title} style={photoStyle} />
            <div style={photoInfoStyle}>
              <h3>{photo.title}</h3>
              <p>{photo.description}</p>
              <small>By: {photo.photographer}</small>
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
  padding: '2rem 1rem'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  cursor: 'pointer'
};

const formStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '2rem',
  borderRadius: '8px',
  marginBottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem'
};

const galleryStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem'
};

const photoCardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden'
};

const photoStyle: React.CSSProperties = {
  width: '100%',
  height: '200px',
  objectFit: 'cover'
};

const photoInfoStyle: React.CSSProperties = {
  padding: '1rem'
};

export default Gallery;
