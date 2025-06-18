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
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data || [];
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

// Hook for realtime members data
export const useRealtimeMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    getMembers().then(data => {
      setMembers(data);
      setLoading(false);
    });

    // Set up realtime subscription
    const channel = supabase
      .channel('members-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setMembers(current => [...current, payload.new as Member]);
          } else if (payload.eventType === 'UPDATE') {
            setMembers(current =>
              current.map(member =>
                member.id === payload.new.id ? (payload.new as Member) : member
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMembers(current =>
              current.filter(member => member.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      } else if (supabase.removeChannel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { members, loading };
};
