import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiInbox } from 'react-icons/fi';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 px-6"
    >
      {/* SVG Illustration */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-8"
      >
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="70" cy="70" r="70" className="fill-indigo-50 dark:fill-indigo-500/10" />
          <rect x="30" y="45" width="80" height="60" rx="10" className="fill-white dark:fill-white/5" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="70" cy="65" r="14" className="fill-indigo-100 dark:fill-indigo-500/20" />
          <path d="M63 65 L70 58 L77 65 M70 58 L70 74" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="42" y="84" width="56" height="8" rx="4" className="fill-indigo-100 dark:fill-indigo-500/20" />
          <rect x="52" y="97" width="36" height="6" rx="3" className="fill-indigo-50 dark:fill-indigo-500/10" />
        </svg>
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No swap requests yet</h3>
      <p className="text-gray-500 dark:text-gray-500 text-center max-w-xs text-sm leading-relaxed">
        Be the first student to post one. It only takes 30 seconds!
      </p>
      <button
        onClick={() => document.querySelector('#post-request')?.scrollIntoView({ behavior: 'smooth' })}
        className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all duration-200"
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
      className="col-span-full flex flex-col items-center justify-center py-20 px-6"
    >
      <FiInbox size={40} className="text-gray-300 dark:text-gray-700 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
      <p className="text-gray-500 dark:text-gray-500 text-sm text-center mb-5">
        Try adjusting your search or filters.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
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
          // Fall back to localStorage
          try {
            const saved = localStorage.getItem('swapfinder_whatsapp_groups');
            if (saved) setGroupLinks(JSON.parse(saved));
          } catch (e) {
            console.error('Error loading from localStorage:', e);
          }
        } else if (data && data.length > 0) {
          // Convert array to object keyed by section
          const linksObj = {};
          data.forEach(row => {
            if (row.section && row.link) {
              linksObj[row.section] = row.link;
            }
          });
          // Merge with initial links
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

    // Subscribe to real-time updates
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
      // Use upsert to insert or update
      const { data, error } = await supabase
        .from('group_links')
        .upsert(
          [{ section: selectedSection, link: trimmed }],
          { onConflict: 'section' }
        );

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Update local state
      setGroupLinks(prev => ({
        ...prev,
        [selectedSection]: trimmed
      }));

      setGroupStatus('Link saved and shared with all users!');
      setNewGroupUrl('');
    } catch (err) {
      console.error('Error saving group link:', err);
      setGroupStatus('Error saving link. Please try again.');
    }
  };

  const availableGroupCount = SECTION_KEYS.filter(section => groupLinks[section]).length;

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
    <section id="community-board" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 mb-4">
            Step 3
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Community Board
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Browse all active swap requests from the community.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#161620] border border-gray-100 dark:border-white/5 rounded-2xl p-4 mb-6 shadow-sm"
        >
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="relative">
              <FiSearch
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"
              />
              <input
                id="search-board"
                type="text"
                placeholder="Search by name, roll, or section..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="relative">
              <select
                id="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none cursor-pointer transition-all duration-200"
              >
                {SORTS.map(s => (
                  <option key={s} value={s} className="bg-white dark:bg-[#161620] text-gray-900 dark:text-white">
                    {s}
                  </option>
                ))}
              </select>
              <FiFilter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                id={`filter-${f.replace(' ', '-').toLowerCase()}`}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                {f}
              </button>
            ))}
            {(search || activeFilter !== 'All') && (
              <button
                onClick={clearFilters}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200"
              >
                Clear All
              </button>
            )}
            {/* Count */}
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-600 self-center">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6"
        >
          <div className="rounded-3xl bg-white dark:bg-[#161620] border border-gray-100 dark:border-white/5 p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-300 font-semibold">Unofficial WhatsApp groups</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select your section to view the unofficial group link or add one if it is missing.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <label htmlFor="section-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select section
                </label>
                <select
                  id="section-select"
                  value={selectedSection}
                  onChange={e => {
                    setSelectedSection(e.target.value);
                    setGroupStatus('');
                    setNewGroupUrl('');
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {SECTION_KEYS.map(section => (
                    <option key={section} value={section} className="bg-white dark:bg-[#161620] text-gray-900 dark:text-white">
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedSection}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unofficial WhatsApp group link</p>
                  </div>
                  {groupLinks[selectedSection] ? (
                    <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-xs font-semibold">
                      Missing
                    </span>
                  )}
                </div>

                {groupLinks[selectedSection] ? (
                  <a
                    href={groupLinks[selectedSection]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-300 hover:text-indigo-500 underline"
                  >
                    Open WhatsApp group
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No unofficial group link available for this section yet.</p>
                )}
              </div>

              <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5">
                <label htmlFor="group-link-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Add or update link for {selectedSection}
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    id="group-link-input"
                    type="url"
                    value={newGroupUrl}
                    onChange={e => setNewGroupUrl(e.target.value)}
                    placeholder="Paste WhatsApp group URL"
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12121b] px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={saveGroupLink}
                    className="w-full sm:w-auto rounded-xl bg-indigo-600 text-white px-5 py-3 text-sm font-semibold hover:bg-indigo-500 transition"
                  >
                    Save link
                  </button>
                </div>
                {groupStatus && (
                  <p className="mt-3 text-sm text-rose-500">{groupStatus}</p>
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
              filtered.map(request => (
                <SwapCard key={request.id} request={request} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
