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

const toClientRequest = (row) => ({
  id: String(row.id),
  name: row.name,
  rollNumber: row.roll_number ?? row.rollNumber,
  semester: row.semester,
  currentSection: row.current_section ?? row.currentSection,
  wantedSections: row.wanted_sections ?? row.wantedSections ?? [],
  contact: row.contact,
  note: row.note,
  createdAt: row.created_at ?? row.createdAt,
  likes: row.likes ?? 0,
  saved: row.saved ?? false,
  liked: row.liked ?? false,
  reaction: row.reaction ?? null,
  verified: row.verified ?? false,
  recentlyActive: row.recently_active ?? row.recentlyActive ?? false,
  highlyRated: row.highly_rated ?? row.highlyRated ?? false,
});

const toDbRequest = (request) => ({
  name: request.name,
  roll_number: request.rollNumber,
  semester: request.semester,
  current_section: request.currentSection,
  wanted_sections: request.wantedSections,
  contact: request.contact,
  note: request.note,
  created_at: request.createdAt,
});

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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error.message);
        return;
      }

      setRequests((data ?? []).map(toClientRequest));
    };

    fetchRequests();

    const channel = supabase
      .channel('public:requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'requests' }, (payload) => {
        setRequests((prev) => [toClientRequest(payload.new), ...prev]);
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
      .insert([toDbRequest(newRequest)])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return null;
    }

    const clientRequest = toClientRequest(inserted);
    setRequests((prev) => [clientRequest, ...prev]);
    setActiveRequestId(String(clientRequest.id));
    return String(clientRequest.id);
  }, []);

  const deleteRequest = useCallback(async (id) => {
    const normalizedId = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    const { error } = await supabase.from('requests').delete().eq('id', normalizedId);
    if (error) {
      console.error('Supabase delete error:', error.message);
      return;
    }
    setRequests(prev => prev.filter(r => r.id !== id));
    setActiveRequestId(prev => (prev === String(id) ? null : prev));
  }, []);

  const toggleLike = useCallback((id) => {
    setRequests(prev => prev.map(r =>
      r.id === id
        ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
        : r
    ));
  }, []);

  const toggleSave = useCallback((id) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, saved: !r.saved } : r
    ));
  }, []);

  const setReaction = useCallback((id, reaction) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, reaction: r.reaction === reaction ? null : reaction } : r
    ));
  }, []);

  const matches = useMemo(() => {
    if (!activeRequestId) return [];

    const result = [];
    for (let i = 0; i < requests.length; i++) {
      for (let j = i + 1; j < requests.length; j++) {
        const a = requests[i];
        const b = requests[j];
        
        // Check if sections match
        const aWantsB = a.wantedSections.includes(b.currentSection);
        const bWantsA = b.wantedSections.includes(a.currentSection);
        
        // Determine if at least one person's wanted sections are included (partial or complete match)
        const hasMatch = aWantsB || bWantsA;
        
        // Only show if this request is involved and there's at least a partial match
        if (hasMatch && (a.id === activeRequestId || b.id === activeRequestId)) {
          // Determine match type
          const matchType = aWantsB && bWantsA ? 'complete' : 'partial';
          result.push({ a, b, key: `${a.id}-${b.id}`, matchType, aWantsB, bWantsA });
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
