import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getGalleryItems, prefetchGalleryThumbnails, GalleryItem } from '../services/galleryService';
import '../styles/Gallery.css'; // Create or update this CSS file for gallery styling

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Refs to prevent stale closure in scroll handler
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  // Load gallery items with improved performance
  const loadGalleryItems = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const { items, hasMore: more } = await getGalleryItems(pageNum);
      setGalleryItems(prev => append ? [...prev, ...items] : items);
      setHasMore(more);
    } catch (error) {
      console.error('Failed to load gallery items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more items when scrolling
  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMoreRef.current) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        loadGalleryItems(nextPage, true);
        return nextPage;
      });
    }
  }, [loadGalleryItems]);

  useEffect(() => {
    // Initial load
    loadGalleryItems(1);

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
    // eslint-disable-next-line
  }, [loadGalleryItems, loadMore]);

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
    </div>
  );
};

export default Gallery;
