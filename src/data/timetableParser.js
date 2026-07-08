/**
 * timetableParser.js
 * Parses the raw timetable_data.json and provides structured helpers
 * for building combined schedules from CSE Core + PE-1 + PE-2 selections.
 *
 * Data schema in timetable_data.json:
 *   {
 *     periods: [{ period, time }],
 *     groups: {
 *       [groupKey]: {
 *         Monday:    [{ period, time, subject, faculty, room }],
 *         Tuesday:   [...],
 *         Wednesday: [...],
 *         Thursday:  [...],
 *         Friday:    [...],
 *       }
 *     }
 *   }
 *
 * Group key prefixes observed:
 *   CSE Core  →  CS1…CS61, CSCE1, CSSE1, IT1, IT2
 *   PE-1      →  DOS1…DOS22, HPC1…HPC23, IPA1…IPA17, CD1…CD14, CI1…CI10, SVP1…SVP14, DMDW1…DMDW20
 *   PE-2      →  AI1, BD1, BDS1, BDS2, PSIOT1
 */

import rawData from '../../data/timetable_data.json';

// ─── Classify groups ──────────────────────────────────────────────────────────

const CORE_PREFIXES = ['CS', 'CSCE', 'CSSE', 'IT'];
const PE1_PREFIXES  = ['HPC', 'DOS', 'AI', 'IPA', 'DSA'];
const PE2_PREFIXES  = ['CD', 'DMDW', 'PSIOT', 'CI', 'BD', 'NIC', 'MLC', 'SVP', 'BDS'];

/** Return the alphabetic prefix of a group key, e.g. 'CS44' → 'CS' */
const prefix = (key) => key.replace(/[0-9]+$/, '');

const allKeys = Object.keys(rawData.groups);

export const coreKeys = allKeys.filter(k => CORE_PREFIXES.includes(prefix(k)));
export const pe1Keys  = allKeys.filter(k => PE1_PREFIXES.includes(prefix(k)));
export const pe2Keys  = allKeys.filter(k => PE2_PREFIXES.includes(prefix(k)));

// ─── Human-readable labels ────────────────────────────────────────────────────

/** Map an internal group key to a user-facing display label */
export function groupLabel(key) {
  const p = prefix(key);
  const num = key.slice(p.length);
  const labels = {
    CS:    `CSE ${num}`,
    CSCE:  `CSE (CE) ${num}`,
    CSSE:  `CSE (SE) ${num}`,
    IT:    `IT ${num}`,
    DOS:   `DOS ${num}`,
    HPC:   `HPC ${num}`,
    IPA:   `IPA ${num}`,
    CD:    `CD ${num}`,
    CI:    `CI ${num}`,
    SVP:   `SVP ${num}`,
    DMDW:  `DMDW ${num}`,
    AI:    `AI ${num}`,
    BD:    `BD ${num}`,
    BDS:   `BDS ${num}`,
    PSIOT: `PSIOT ${num}`,
    DSA:   `DSA ${num}`,
    NIC:   `NIC ${num}`,
    MLC:   `MLC ${num}`,
  };
  return labels[p] ?? key;
}

// ─── PE names ─────────────────────────────────────────────────────────────────

const PE_FULL_NAMES = {
  DOS:   'Distributed Operating Systems',
  HPC:   'High Performance Computing',
  IPA:   'Image Processing and Applications',
  CD:    'Compiler',
  CI:    'Computational Intelligence',
  SVP:   'Speech and Video Processing',
  DMDW:  'Data Mining and Data Warehousing',
  AI:    'Artificial Intelligence',
  BD:    'Big Data',
  BDS:   'Bigdata Using SCALA',
  PSIOT: 'Privacy and Security in IoT',
  DSA:   'Data Science and Analytics',
  NIC:   'Nature Inspired Computing',
  MLC:   'Machine Learning Concepts',
};

export function electiveName(key) {
  return PE_FULL_NAMES[prefix(key)] ?? prefix(key);
}

// ─── Schedule merging ─────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/**
 * Build a combined weekly schedule from three group keys.
 * Returns an object keyed by day, each containing a sorted array of slots:
 *   { period, time, subject, faculty, room, source: 'core'|'pe1'|'pe2' }
 */
export function buildCombinedSchedule(coreKey, pe1Key, pe2Key) {
  const combined = {};

  for (const day of DAYS) {
    const slots = [];

    const addSlots = (key, source) => {
      if (!key) return;
      const dayData = rawData.groups[key]?.[day] ?? [];
      dayData.forEach(slot => slots.push({ ...slot, source }));
    };

    addSlots(coreKey, 'core');
    addSlots(pe1Key,  'pe1');
    addSlots(pe2Key,  'pe2');

    // Sort by period number
    slots.sort((a, b) => {
      const numA = parseInt(a.period.replace('P', ''), 10);
      const numB = parseInt(b.period.replace('P', ''), 10);
      return numA - numB;
    });

    combined[day] = slots;
  }

  return combined;
}

/**
 * Format a period time string (24h "HH:MM") to "H:MM AM/PM"
 */
export function formatTime(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Given a period string like "P5", return the end-time (period + 1 hour)
 */
export function endTime(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  return formatTime(`${h + 1}:${m.toString().padStart(2, '0')}`);
}

export const DAYS_LIST = DAYS;
