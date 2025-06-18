import { supabaseClient as supabase } from '../supabase/client';

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
  // Calculate the range for pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('gallery')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching gallery items:', error);
    return { items: [], totalCount: 0, hasMore: false };
  }

  return { 
    items: data || [], 
    totalCount: count || 0,
    hasMore: count ? from + pageSize < count : false
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
