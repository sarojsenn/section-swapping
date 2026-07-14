import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useSwap } from '../context/SwapContext';
import { supabase } from '../lib/supabaseClient';
import SwapCard from './SwapCard';

const FILTERS = ['All', '3rd Semester', '5th Semester', 'Recommended for You'];
const SORTS = ['Newest', 'Oldest'];

const SECTION_KEYS = Array.from({ length: 61 }, (_, index) => `CSE${index + 1}`);
const INITIAL_GROUP_LINKS = {
  CSE1: 'https://chat.whatsapp.com/HhW1xF22pj48Aqv7AoEKSZ',
  CSE3: 'https://chat.whatsapp.com/Lwy350dRxGU4E6OG8fw3XS',
  CSE4: 'https://chat.whatsapp.com/F3IlS82SFURIqfvSU3DQCD',
  CSE6: 'https://chat.whatsapp.com/D6iawY6auU5376DkNj9uQS?s=cl&p=a&ilr=1&amv=1',
  CSE7: 'https://chat.whatsapp.com/IYIabVykxeCG26EHmiNQNn?s=cl&p=a&ilr=1&amv=1',
  CSE11: 'https://chat.whatsapp.com/HRx0H5b7kIJ3q416y5D2g5',
  CSE12: 'https://chat.whatsapp.com/BcklRD3gHwk9XR4BoOHx6M',
  CSE13: 'https://chat.whatsapp.com/ESuotJYqlb11JrNXZJJ47S?s=cl&p=a&mlu=1',
  CSE15: 'https://chat.whatsapp.com/Ijr7PvqGAMQCyHK4mil2Wf?s=sw&p=a&mlu=0',
  CSE17: 'https://chat.whatsapp.com/LO8wBiZCIpHGcuY8lBSKyL',
  CSE18: 'https://chat.whatsapp.com/CEueUFwDrLbGYd8t7uwgQ8',
  CSE20: 'https://chat.whatsapp.com/GULAIZGBAPaGWLhosEKLJA?mode=gi_t',
  CSE21: 'https://chat.whatsapp.com/BCstrN4dlzeKQ2XCidJV7d?mode=gi_t',
  CSE22: 'https://chat.whatsapp.com/BlWR6UTfqRHB1NpNc3arFu?s=cl&p=a&mlu=0&amv=0',
  CSE23: 'https://chat.whatsapp.com/Litj4X3D9XfF9I27Hhcl3x',
  CSE25: 'https://chat.whatsapp.com/HCmJj30mltL624rfxBtE4T',
  CSE26: 'https://chat.whatsapp.com/JNemYZ9qWTCBw6WQEpyf1a?s=cl&p=a&ilr=0',
  CSE27: 'https://chat.whatsapp.com/D6ZZxvTjbLu90SqM6dMSTe',
  CSE29: 'https://chat.whatsapp.com/KEsqoV3daoyHKiReG6C9si',
  CSE31: 'https://chat.whatsapp.com/FVIU2qje6JyF7oRX7rM82I',
  CSE33: 'https://chat.whatsapp.com/BrrzilsLfkq4rT9MVMHXjV',
  CSE35: 'https://chat.whatsapp.com/JfdTGzdB5DDJwx0LAQ1TYv',
  CSE37: 'https://chat.whatsapp.com/K6c3epFU52h9Fq5Xpel0vn',
  CSE38: 'https://chat.whatsapp.com/KVgh9mrbYmEGaCEGXWMvNo?s=sw&p=a&ilr=0',
  CSE40: 'https://chat.whatsapp.com/DRI6JE16fPM0RJYGIXheTQ?s=cl&p=a&ilr=4',
  CSE41: 'https://chat.whatsapp.com/DgFzvGFJWzg0eXNZ00wFPN',
  CSE42: 'https://chat.whatsapp.com/CPdiuOEU0N7Eiw3MwoAUTf?s=sw&p=a&mlu=3',
  CSE43: 'https://chat.whatsapp.com/L7A5AM84pc01yZqsfQNl31',
  CSE44: 'https://chat.whatsapp.com/EifR091rWtD5SWKPRtVnlE',
  CSE45: 'https://chat.whatsapp.com/Djj6resRhMQ4dTX3yD49W6',
  CSE46: 'https://chat.whatsapp.com/EuVejQnfk281EgGh6Ac3O0',
  CSE49: 'https://chat.whatsapp.com/GU1gyIlvsOvAirPGA6rlM0',
  CSE50: 'https://chat.whatsapp.com/Lhj6EM2RS857RTP3QUCW1s',
  CSE51: 'https://chat.whatsapp.com/HldPqGAVJgy8BaiZH2x3nX',
  CSE52: 'https://chat.whatsapp.com/LulS0rSWOCAAzqKCXkrcWl?s=cl&p=a&ilr=2',
  CSE53: 'https://chat.whatsapp.com/J6fLypSlC8yGx3unJuRWsH?mode=gi_t',
  CSE55: 'https://chat.whatsapp.com/DPOM5ObEfLP0EdeBL0XeIe',
  CSE56: 'https://chat.whatsapp.com/FrtjdcPA3a001Zu4yTWNX?s=cl&p=a&mlu=2&amv=0',
  CSE57: 'https://chat.whatsapp.com/LE8zV99ApNxAHEc78x8tfl',
  CSE59: 'https://chat.whatsapp.com/H3AA7yVsZ3oIqu2Wb8ynQz',
  CSE60: 'https://chat.whatsapp.com/HODzpv9oMPi5FKO8OEbx6t',
  CSE61: 'https://chat.whatsapp.com/E5HHoMARD2t5aufDkjgviU?s=cl&p=a&ilr=2',
};

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="text-6xl mb-4">📭</div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No requests yet</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs text-sm font-medium">
        Be the first to post a request. It only takes a minute!
      </p>
      <button
        onClick={() => document.querySelector('#post-request')?.scrollIntoView({ behavior: 'smooth' })}
        className="mt-5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
      >
        Post a Request
      </button>
    </motion.div>
  );
}

function NoResults({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="text-5xl mb-4">🔎</div>
      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">No results found</h3>
      <p className="text-gray-400 dark:text-gray-500 text-sm text-center mb-5 font-medium">
        Try adjusting your filters or search term.
      </p>
      <button
        onClick={onClear}
        className="px-4 py-2 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors duration-150"
      >
        Clear Filters
      </button>
    </motion.div>
  );
}

export default function CommunityBoard() {
  const { requests } = useSwap();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [groupLinks, setGroupLinks] = useState(INITIAL_GROUP_LINKS);
  const [selectedSection, setSelectedSection] = useState(SECTION_KEYS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const [newGroupUrl, setNewGroupUrl] = useState('');
  const [groupStatus, setGroupStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch group links from Supabase
  useEffect(() => {
    const fetchGroupLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('group_links')
          .select('*');

        if (error) {
          console.error('Error fetching group links:', error);
          try {
            const saved = localStorage.getItem('swapfinder_whatsapp_groups');
            if (saved) setGroupLinks(JSON.parse(saved));
          } catch (e) {
            console.error('Error loading from localStorage:', e);
          }
        } else if (data && data.length > 0) {
          const linksObj = {};
          data.forEach(row => {
            if (row.section && row.link) {
              linksObj[row.section] = row.link;
            }
          });
          const merged = { ...INITIAL_GROUP_LINKS, ...linksObj };
          setGroupLinks(merged);
        }
      } catch (err) {
        console.error('Failed to fetch group links:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupLinks();

    const subscription = supabase
      .channel('group_links')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_links' }, (payload) => {
        if (payload.new && payload.new.section && payload.new.link) {
          setGroupLinks(prev => ({
            ...prev,
            [payload.new.section]: payload.new.link
          }));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const saveGroupLink = async () => {
    const trimmed = newGroupUrl.trim();
    if (!trimmed) {
      setGroupStatus('Enter a valid WhatsApp group link.');
      return;
    }

    try {
      const { error } = await supabase
        .from('group_links')
        .upsert(
          [{ section: selectedSection, link: trimmed }],
          { onConflict: 'section' }
        );

      if (error) throw error;

      setGroupLinks(prev => ({
        ...prev,
        [selectedSection]: trimmed
      }));

      setGroupStatus('Link saved and shared!');
      setNewGroupUrl('');
    } catch (err) {
      console.error('Error saving group link:', err);
      setGroupStatus('Error saving link. Please try again.');
    }
  };

  const filtered = useMemo(() => {
    let list = [...requests];

    if (activeFilter === '3rd Semester') list = list.filter(r => r.semester === '3rd');
    else if (activeFilter === '5th Semester') list = list.filter(r => r.semester === '5th');
    else if (activeFilter === 'Recommended for You') list = list.filter(r => r.highlyRated || r.verified);

    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        r.currentSection.toLowerCase().includes(q) ||
        r.wantedSections.some(s => s.toLowerCase().includes(q))
      );
    }

    if (sort === 'Newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return list;
  }, [requests, search, activeFilter, sort]);

  const clearFilters = () => {
    setSearch('');
    setActiveFilter('All');
    setSort('Newest');
  };

  return (
    <section id="community-board" className="py-20 px-4 sm:px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Step 3
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Community Board
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Browse all active swap requests from the community.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl p-4 mb-6 shadow-sm"
        >
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="relative">
              <FiSearch
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                id="search-board"
                type="text"
                placeholder="Search by name, roll, or section..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors duration-150"
              />
            </div>

            <div className="relative">
              <select
                id="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full pl-4 pr-8 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none cursor-pointer transition-colors duration-150"
              >
                {SORTS.map(s => (
                  <option key={s} value={s} className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white">
                    {s}
                  </option>
                ))}
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                id={`filter-${f.replace(' ', '-').toLowerCase()}`}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 ${
                  activeFilter === f
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/40'
                }`}
              >
                {f}
              </button>
            ))}
            {(search || activeFilter !== 'All') && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150"
              >
                Clear Filters
              </button>
            )}
            <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500 self-center">
              {filtered.length} request{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* WhatsApp widget */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6"
        >
          <div className="rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-5">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                  💬 WhatsApp Groups for 5th Sem only
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Select your section to access the unofficial WhatsApp group link.
                </p>
              </div>
              <div className="w-full md:w-48">
                <select
                  id="section-select"
                  value={selectedSection}
                  onChange={e => {
                    setSelectedSection(e.target.value);
                    setGroupStatus('');
                    setNewGroupUrl('');
                  }}
                  className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {SECTION_KEYS.map(section => (
                    <option key={section} value={section} className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white">
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedSection}</p>
                  {groupLinks[selectedSection] ? (
                    <a
                      href={groupLinks[selectedSection]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Join WhatsApp Group →
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">No link posted yet</p>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${groupLinks[selectedSection] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {groupLinks[selectedSection] ? 'Active' : 'Missing'}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
                <div className="flex gap-2">
                  <input
                    id="group-link-input"
                    type="url"
                    value={newGroupUrl}
                    onChange={e => setNewGroupUrl(e.target.value)}
                    placeholder="Add/update group URL..."
                    className="flex-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={saveGroupLink}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors duration-150"
                  >
                    Save
                  </button>
                </div>
                {groupStatus && (
                  <p className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{groupStatus}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {requests.length === 0 ? (
              <EmptyState />
            ) : filtered.length === 0 ? (
              <NoResults onClear={clearFilters} />
            ) : (
              filtered.slice(0, 9).map(request => (
                <SwapCard key={request.id} request={request} />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Show More */}
        {filtered.length > 9 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors duration-150"
            >
              Show More ({filtered.length - 9} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-6xl max-h-[85vh] bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-xl flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    🎓 All Swap Requests
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    Showing all {filtered.length} active request{filtered.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-colors duration-150"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {filtered.map(request => (
                    <SwapCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
