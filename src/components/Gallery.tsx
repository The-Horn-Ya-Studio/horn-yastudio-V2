import React, { useEffect, useRef } from 'react';
import { useRealtimeGallery, prefetchGalleryThumbnails, GalleryItem } from '../services/galleryService';
import '../styles/Gallery.css';

const Gallery: React.FC = () => {
  const { items: galleryItems, loading, hasMore, loadMore } = useRealtimeGallery();

  // Ref for tracking bottom of screen for infinite scroll
  const bottomObserverRef = useRef<HTMLDivElement>(null);

  // Initial load actions and scroll listener
  useEffect(() => {
    // Prefetch thumbnails for smoother experience
    prefetchGalleryThumbnails();
    
    // Add scroll event listener for infinite scrolling
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 300 // Load more when near bottom
      ) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <div className="gallery-container">
      <h1>Gallery</h1>
      
      <div className="gallery-grid">
        {galleryItems.map(item => (
          <div key={item.id} className="gallery-item">
            <img 
              src={item.thumbnail_url} 
              alt={item.title} 
              loading="lazy"
              onClick={() => window.open(item.image_url, '_blank')} 
              className="gallery-image"
            />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
      
      {loading && <div className="loading-spinner">Loading...</div>}
      
      {!hasMore && !loading && galleryItems.length > 0 && (
        <p className="end-message">No more items to display</p>
      )}
      
      {!loading && galleryItems.length === 0 && (
        <p className="no-items-message">No gallery items found</p>
      )}

      {/* Reference element for infinite scroll detection */}
      <div ref={bottomObserverRef} style={{ height: "10px" }}></div>
    </div>
  );
};

export default Gallery;
