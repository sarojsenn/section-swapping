import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useSwap } from '../context/SwapContext';
import { getInitials, getAvatarColor } from '../utils/helpers';

function StudentCard({ request }) {
  const avatarColor = getAvatarColor(request.name);
  const semColor = request.semester === '3rd'
    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
    : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300';

  return (
    <div className="flex-1 p-4 sm:p-5 rounded-xl bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/10">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
          {getInitials(request.name)}
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-sm">{request.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">{request.rollNumber}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${semColor}`}>
            {request.semester} Semester
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1.5">Current</p>
          <span className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-bold border border-blue-200 dark:border-blue-500/30">
            Section {request.currentSection}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1.5">Wanted</p>
          <div className="flex flex-wrap gap-1.5">
            {request.wantedSections.map(s => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, index }) {
  const isCompleteMatch = match.matchType === 'complete';
  const emoji = isCompleteMatch ? '🎉' : '💬';
  const statusText = isCompleteMatch ? 'Complete Match!' : 'Partial Match';
  const descriptionText = isCompleteMatch 
    ? 'These two students can directly swap sections'
    : 'Talk to adjust and make a swap that works for both';
  
  const headerGradient = isCompleteMatch 
    ? 'from-indigo-500 via-purple-500 to-pink-500'
    : 'from-amber-500 via-orange-500 to-rose-500';
  const badgeGradient = isCompleteMatch
    ? 'from-indigo-500 to-purple-500'
    : 'from-amber-500 to-orange-500';
  const badgeText = isCompleteMatch ? 'COMPLETE MATCH ✓' : 'CAN ADJUST 🔄';

  return (
    <motion.div
      key={match.key}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative p-1 rounded-2xl bg-gradient-to-r ${headerGradient} shadow-xl ${isCompleteMatch ? 'shadow-indigo-500/20' : 'shadow-amber-500/20'}`}
    >
      <div className="bg-white dark:bg-[#161620] rounded-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl"
            >
              {emoji}
            </motion.span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-base">{statusText}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{descriptionText}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${badgeGradient} text-white text-xs font-bold shadow-lg ${isCompleteMatch ? 'shadow-indigo-500/30' : 'shadow-amber-500/30'}`}>
            {badgeText}
          </div>
        </div>

        {/* Students */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <StudentCard request={match.a} />

          {/* Arrow */}
          <div className="flex items-center justify-center py-2 sm:py-0">
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">↔</span>
              </div>
            </div>
          </div>

          <StudentCard request={match.b} />
        </div>

        {/* Contact hint */}
        <div className={`mt-4 pt-4 border-t ${isCompleteMatch ? 'border-gray-100 dark:border-white/5' : 'border-amber-100 dark:border-amber-500/10'}`}>
          {isCompleteMatch ? (
            <p className="text-xs text-center text-gray-500 dark:text-gray-600">
              💬 Contact each other to confirm the swap
            </p>
          ) : (
            <div className="text-xs text-center">
              <p className="text-amber-700 dark:text-amber-300 font-semibold mb-1">
                ⚠️ Partial Match - Requires discussion
              </p>
              <p className="text-gray-500 dark:text-gray-600">
                Connect and discuss to find a mutually beneficial swap arrangement
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MatchesSection() {
  const { matches, requests, activeRequestId } = useSwap();

  const activeRequest = useMemo(() => {
    return requests.find((request) => request.id === activeRequestId);
  }, [requests, activeRequestId]);

  return (
    <section id="matches" className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-4">
            Step 2
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Your Matches
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Automatically detected compatible swap pairs using your selected request.
          </p>
        </motion.div>

        {/* Active request summary */}
        {activeRequest ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161620] p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300 font-semibold">Selected Request</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activeRequest.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current section {activeRequest.currentSection} · Wants {activeRequest.wantedSections.join(', ')}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-200 px-4 py-2 text-sm font-semibold">
                {matches.length} compatible match{matches.length !== 1 ? 'es' : ''}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a request from the community board to see personalized matches here.
            </p>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {matches.length === 0 ? (
            <motion.div
              key="no-matches"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16 px-8 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/2"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No matches yet</h3>
              <p className="text-gray-500 dark:text-gray-500 text-sm max-w-sm mx-auto">
                Post a request and we&apos;ll automatically find compatible swaps from the community board.
              </p>
              <button
                onClick={() => document.querySelector('#post-request')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
              >
                Post a Request <FiArrowRight size={14} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="matches-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {matches.map((match, i) => (
                <MatchCard key={match.key} match={match} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
