import { supabaseClient as supabase } from '../supabase/client';
import { useEffect, useState } from 'react';

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  featured: boolean;
  // Add other member properties
}

// Fetch all members with regular query
export const getMembers = async (): Promise<Member[]> => {
  const res = await fetch('/api/members');
  if (!res.ok) return [];
  return await res.json();
};

// Fetch featured members
export const getFeaturedMembers = async (limit = 4): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('featured', true)
    .order('name')
    .limit(limit);

  if (error) {
    console.error('Error fetching featured members:', error);
    return [];
  }
  return data || [];
};

// Hook for realtime members data - improved version
export const useRealtimeMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch function that we can reuse
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching members:', error);
          return;
        }
        
        setMembers(data || []);
      } finally {
        setLoading(false);
      }
    };

    // Initial data load
    fetchData();

    // Set up realtime subscription
    const channel = supabase
      .channel('realtime-members')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        (payload) => {
          console.log('Member change received!', payload);
          // Simple approach - fetch all data again on any change 
          // This ensures we always have fresh, sorted data
          fetchData();
        }
      )
      .subscribe();

    return () => {
      // Clean up subscription when component unmounts
      supabase.removeChannel(channel);
    };
  }, []);

  return { members, loading };
};
