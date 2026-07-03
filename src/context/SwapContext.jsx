import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

const SwapContext = createContext(null);

const STORAGE_KEY = 'swapfinder_swap_requests';
const ACTIVE_REQUEST_KEY = 'swapfinder_active_request';

function loadFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function SwapProvider({ children }) {
  const [requests, setRequests] = useState(loadFromStorage);
  const [activeRequestId, setActiveRequestId] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(ACTIVE_REQUEST_KEY);
    } catch {
      return null;
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('swapfinder_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    }
  }, [requests]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeRequestId) {
        localStorage.setItem(ACTIVE_REQUEST_KEY, activeRequestId);
      } else {
        localStorage.removeItem(ACTIVE_REQUEST_KEY);
      }
    }
  }, [activeRequestId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('swapfinder_dark_mode', JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error.message);
        return;
      }

      setRequests(data ?? []);
    };

    fetchRequests();

    const channel = supabase
      .channel('public:requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'requests' }, (payload) => {
        setRequests((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const addRequest = useCallback(async (data) => {
    const newRequest = {
      ...data,
      createdAt: new Date().toISOString(),
      likes: 0,
      saved: false,
      liked: false,
      reaction: null,
      verified: Math.random() < 0.35,
      recentlyActive: true,
      highlyRated: Math.random() < 0.25,
    };

    const { data: inserted, error } = await supabase
      .from('requests')
      .insert([newRequest])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return null;
    }

    setRequests((prev) => [inserted, ...prev]);
    setActiveRequestId(inserted.id);
    return inserted.id;
  }, []);

  const deleteRequest = useCallback(async (id) => {
    const { error } = await supabase.from('requests').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error.message);
      return;
    }
    setRequests(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggleLike = useCallback(async (id) => {
    setRequests(prev => prev.map(r =>
      r.id === id
        ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
        : r
    ));
    const request = requests.find(r => r.id === id);
    if (!request) return;
    const updatedLikes = request.liked ? request.likes - 1 : request.likes + 1;
    const updatedLiked = !request.liked;
    const { error } = await supabase.from('requests').update({ likes: updatedLikes, liked: updatedLiked }).eq('id', id);
    if (error) console.error('Supabase like update error:', error.message);
  }, [requests]);

  const toggleSave = useCallback(async (id) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, saved: !r.saved } : r
    ));
    const request = requests.find(r => r.id === id);
    if (!request) return;
    const { error } = await supabase.from('requests').update({ saved: !request.saved }).eq('id', id);
    if (error) console.error('Supabase save update error:', error.message);
  }, [requests]);

  const setReaction = useCallback(async (id, reaction) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, reaction: r.reaction === reaction ? null : reaction } : r
    ));
    const request = requests.find(r => r.id === id);
    if (!request) return;
    const nextReaction = request.reaction === reaction ? null : reaction;
    const { error } = await supabase.from('requests').update({ reaction: nextReaction }).eq('id', id);
    if (error) console.error('Supabase reaction update error:', error.message);
  }, [requests]);

  const matches = useMemo(() => {
    if (!activeRequestId) return [];

    const result = [];
    for (let i = 0; i < requests.length; i++) {
      for (let j = i + 1; j < requests.length; j++) {
        const a = requests[i];
        const b = requests[j];
        const aWantsB = a.wantedSections.includes(b.currentSection);
        const bWantsA = b.wantedSections.includes(a.currentSection);
        if (aWantsB && bWantsA && (a.id === activeRequestId || b.id === activeRequestId)) {
          result.push({ a, b, key: `${a.id}-${b.id}` });
        }
      }
    }
    return result;
  }, [requests, activeRequestId]);

  return (
    <SwapContext.Provider value={{
      requests, addRequest, deleteRequest, toggleLike, toggleSave, setReaction,
      matches, activeRequestId, setActiveRequestId, darkMode, setDarkMode
    }}>
      {children}
    </SwapContext.Provider>
  );
}

export function useSwap() {
  const ctx = useContext(SwapContext);
  if (!ctx) throw new Error('useSwap must be used within SwapProvider');
  return ctx;
}
