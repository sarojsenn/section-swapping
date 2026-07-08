import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiList, FiGrid, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import {
  coreKeys,
  pe1Keys,
  pe2Keys,
  groupLabel,
  electiveName,
  buildCombinedSchedule,
  formatTime,
  endTime,
  DAYS_LIST,
} from '../data/timetableParser';

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY_JS_DAY = new Date().getDay(); // 0=Sun,1=Mon…6=Sat
const TODAY_IDX    = TODAY_JS_DAY >= 1 && TODAY_JS_DAY <= 5 ? TODAY_JS_DAY - 1 : 0;

/** Source badge styling */
const SOURCE_STYLE = {
  core: {
    dot:   'bg-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    label: 'Core',
  },
  pe1: {
    dot:   'bg-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    label: 'PE-1',
  },
  pe2: {
    dot:   'bg-purple-400',
    badge: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    label: 'PE-2',
  },
};

const PERIODS_TIMES = [
  { period: 'P1',  time: '08:00' },
  { period: 'P2',  time: '09:00' },
  { period: 'P3',  time: '10:00' },
  { period: 'P4',  time: '11:00' },
  { period: 'P5',  time: '12:00' },
  { period: 'P6',  time: '13:00' },
  { period: 'P7',  time: '14:00' },
  { period: 'P8',  time: '15:00' },
  { period: 'P9',  time: '16:00' },
  { period: 'P10', time: '17:00' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A single styled dropdown */
function TimetableSelect({ id, label, value, onChange, options }) {
  return (
    <div className="flex-1 min-w-0">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-white/10
                     bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white
                     text-sm font-semibold
                     focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
                     outline-none cursor-pointer transition-colors duration-150"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Custom chevron */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

/** Slot card used in Daily Feed */
function SlotCard({ slot, index }) {
  const style = SOURCE_STYLE[slot.source];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="flex gap-4 group"
    >
      {/* Time column */}
      <div className="w-20 flex-shrink-0 pt-1 text-right">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatTime(slot.time)}</p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">{endTime(slot.time)}</p>
      </div>

      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${style.dot} ring-4 ring-white dark:ring-[#1a1a1a]`} />
        <div className="w-px flex-1 bg-gray-100 dark:bg-white/8 mt-1" />
      </div>

      {/* Card */}
      <div className="flex-1 mb-4">
        <div
          className="p-4 rounded-xl border border-gray-100 dark:border-white/8
                     bg-white dark:bg-[#111111]
                     group-hover:border-gray-200 dark:group-hover:border-white/15
                     transition-colors duration-150 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-base leading-tight">{slot.subject}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{slot.period}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${style.badge} whitespace-nowrap`}>
              {style.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <FiMapPin size={11} />
              {slot.room}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUser size={11} />
              {slot.faculty}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Daily Feed view */
function DailyFeedView({ schedule, day }) {
  const slots = schedule[day] ?? [];

  if (slots.length === 0) {
    return (
      <motion.div
        key="empty-day"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-16 text-center"
      >
        <div className="text-4xl mb-4">🎉</div>
        <p className="font-bold text-gray-700 dark:text-gray-300 text-base">No classes on {day}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Enjoy your free day!</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={day}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        className="pt-2"
      >
        {slots.map((slot, i) => (
          <SlotCard key={`${slot.period}-${slot.subject}-${i}`} slot={slot} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/** Weekly Table view */
function WeeklyTableView({ schedule }) {
  // Find all unique periods that appear anywhere in the week
  const activePeriods = useMemo(() => {
    const set = new Set();
    DAYS_LIST.forEach(day => {
      (schedule[day] ?? []).forEach(s => set.add(s.period));
    });
    return PERIODS_TIMES.filter(p => set.has(p.period));
  }, [schedule]);

  if (activePeriods.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400 dark:text-gray-500">No schedule data available.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/8"
    >
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-white/5">
            <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/8 w-24">
              Time
            </th>
            {DAYS_LIST.map(day => {
              const isToday = DAYS_LIST.indexOf(day) === TODAY_IDX;
              return (
                <th
                  key={day}
                  className={`px-3 py-3 text-center text-[11px] font-bold uppercase tracking-widest border-b border-gray-100 dark:border-white/8
                    ${isToday
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-400 dark:text-gray-500'
                    }`}
                >
                  {day.slice(0, 3)}
                  {isToday && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 align-middle">
                      Today
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {activePeriods.map((p, ri) => (
            <tr
              key={p.period}
              className={ri % 2 === 0
                ? 'bg-white dark:bg-transparent'
                : 'bg-gray-50/60 dark:bg-white/[0.02]'}
            >
              {/* Time cell */}
              <td className="px-4 py-3 border-b border-gray-50 dark:border-white/5 whitespace-nowrap">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatTime(p.time)}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{p.period}</p>
              </td>
              {DAYS_LIST.map(day => {
                const slot = (schedule[day] ?? []).find(s => s.period === p.period);
                const style = slot ? SOURCE_STYLE[slot.source] : null;
                return (
                  <td
                    key={day}
                    className="px-2 py-2 border-b border-gray-50 dark:border-white/5 text-center align-middle"
                  >
                    {slot ? (
                      <div
                        className={`inline-flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-lg border text-center w-full max-w-[120px] ${style.badge}`}
                      >
                        <span className="font-bold text-xs">{slot.subject}</span>
                        <span className="text-[10px] opacity-80">{slot.room}</span>
                      </div>
                    ) : (
                      <span className="text-gray-200 dark:text-white/10 text-lg">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

// ─── Main Timetable Section ───────────────────────────────────────────────────

export default function Timetable() {
  const [coreKey, setCoreKey] = useState(coreKeys[0] ?? '');
  const [pe1Key,  setPe1Key]  = useState(pe1Keys[0]  ?? '');
  const [pe2Key,  setPe2Key]  = useState(pe2Keys[0]  ?? '');
  const [view,    setView]    = useState('daily');    // 'daily' | 'weekly'
  const [dayIdx,  setDayIdx]  = useState(TODAY_IDX); // 0=Mon … 4=Fri

  const coreOptions = useMemo(() => coreKeys.map(k => ({ value: k, label: groupLabel(k) })), []);
  const pe1Options  = useMemo(() => pe1Keys.map(k  => ({ value: k, label: `${electiveName(k)} — ${groupLabel(k)}` })), []);
  const pe2Options  = useMemo(() => pe2Keys.map(k  => ({ value: k, label: `${electiveName(k)} — ${groupLabel(k)}` })), []);

  const schedule = useMemo(
    () => buildCombinedSchedule(coreKey, pe1Key, pe2Key),
    [coreKey, pe1Key, pe2Key]
  );

  const selectedDay = DAYS_LIST[dayIdx];

  return (
    <section id="timetable" className="py-20 px-4 sm:px-6 bg-transparent">
      <div className="max-w-5xl mx-auto">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <FiCalendar size={12} />
            5th Semester
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Your Timetable
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Select your section and electives to see your combined weekly schedule.
          </p>
        </motion.div>

        {/* ── Selector Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm p-5 sm:p-6 mb-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <TimetableSelect
              id="core-section-select"
              label="CSE Core Section"
              value={coreKey}
              onChange={setCoreKey}
              options={coreOptions}
            />
            <TimetableSelect
              id="pe1-select"
              label="Professional Elective 1 (PE-1)"
              value={pe1Key}
              onChange={setPe1Key}
              options={pe1Options}
            />
            <TimetableSelect
              id="pe2-select"
              label="Professional Elective 2 (PE-2)"
              value={pe2Key}
              onChange={setPe2Key}
              options={pe2Options}
            />
          </div>

          {/* Summary + View toggle row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-white/8">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing schedule for{' '}
              <strong className="text-gray-800 dark:text-gray-200 font-semibold">{groupLabel(coreKey)}</strong>
              {' + '}
              <strong className="text-gray-800 dark:text-gray-200 font-semibold">{groupLabel(pe1Key)}</strong>
              {' + '}
              <strong className="text-gray-800 dark:text-gray-200 font-semibold">{groupLabel(pe2Key)}</strong>
            </p>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 p-1 rounded-lg bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10">
              <button
                id="view-toggle-daily"
                onClick={() => setView('daily')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150
                  ${view === 'daily'
                    ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                <FiList size={12} />
                Daily Feed
              </button>
              <button
                id="view-toggle-weekly"
                onClick={() => setView('weekly')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150
                  ${view === 'weekly'
                    ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                <FiGrid size={12} />
                Weekly Table
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Day Selector (Daily Feed only) ── */}
        <AnimatePresence>
          {view === 'daily' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {DAYS_LIST.map((day, i) => {
                  const isToday  = i === TODAY_IDX;
                  const isActive = i === dayIdx;
                  return (
                    <button
                      key={day}
                      id={`day-tab-${day.toLowerCase()}`}
                      onClick={() => setDayIdx(i)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border
                        ${isActive
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-500/40 bg-white dark:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      {day}
                      {isToday && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold
                            ${isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                            }`}
                        >
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Legend ── */}
        <div className="flex flex-wrap items-center gap-4 mb-5">
          {Object.entries(SOURCE_STYLE).map(([src, s]) => (
            <span key={src} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <FiClock size={11} />
            1 hr per period
          </span>
        </div>

        {/* ── Schedule View ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm p-5 sm:p-6 min-h-[300px]"
        >
          <AnimatePresence mode="wait">
            {view === 'daily' ? (
              <DailyFeedView key="daily" schedule={schedule} day={selectedDay} />
            ) : (
              <WeeklyTableView key="weekly" schedule={schedule} />
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
