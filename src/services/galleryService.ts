import { supabaseClient as supabase } from '../supabase/client';
import { useState, useEffect, useCallback } from 'react';

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  created_at: string;
  // Add other gallery item properties
}

// Constants for pagination
const PAGE_SIZE = 12;

// Improved gallery fetching with pagination
export const getGalleryItems = async (
  page = 1,
  pageSize = PAGE_SIZE
): Promise<{ items: GalleryItem[]; totalCount: number; hasMore: boolean }> => {
  const res = await fetch(`/api/gallery?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) return { items: [], totalCount: 0, hasMore: false };
  const { items, totalCount } = await res.json();
  return {
    items,
    totalCount,
    hasMore: totalCount ? (page * pageSize < totalCount) : false
  };
};

// Pre-fetch thumbnails for better performance
export const prefetchGalleryThumbnails = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('thumbnail_url')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE * 2); // Prefetch 2 pages worth

  if (data && !error) {
    (data as { thumbnail_url: string }[]).forEach(item => {
      const img = new window.Image();
      img.src = item.thumbnail_url;
    });
  }
};

// New hook for realtime gallery items
export const useRealtimeGallery = (pageSize = PAGE_SIZE) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Function to load more items
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchGalleryPage = async () => {
      setLoading(true);
      try {
        const from = 0;
        const to = page * pageSize - 1;

        const { data, error, count } = await supabase
          .from('gallery')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) {
          console.error('Error fetching gallery items:', error);
          return;
        }

        setItems(data || []);
        const total = count || 0;
        setTotalCount(total);
        setHasMore(total > page * pageSize);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchGalleryPage();

    // Set up realtime subscription
    const channel = supabase
      .channel('realtime-gallery')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery' },
        () => {
          console.log('Gallery change received!');
          // Refresh data when a change occurs
          fetchGalleryPage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page, pageSize]);

  return { items, totalCount, loading, hasMore, loadMore };
};
