/**
 * timetableParser.js
 * Parses the raw timetable_dataset.json and provides structured helpers
 * for building combined schedules from Core + PE-1 + PE-2 selections.
 */

import rawData from '../../data/timetable_dataset.json';
import studentData from '../../data/Roll_wise section allocated 5th sem/student_sections.json';

// ─── Student Roll No Lookup ───────────────────────────────────────────────────

export function getStudentInfo(rollNo) {
  return studentData.students[rollNo];
}

export function constructStudentKeys(student) {
  if (!student) return null;
  const coreKey = student.core ? `${student.core.branch}__${student.core.section}` : '';
  const pe1Key = student.pe1 ? `${student.pe1.subject}-S5-PE1__${student.pe1.section}` : '';
  const pe2Key = student.pe2 ? `${student.pe2.subject}-S5-PE2__${student.pe2.section}` : '';
  return { coreKey, pe1Key, pe2Key };
}

// ─── Semesters ────────────────────────────────────────────────────────────────
export const semesters = rawData.meta.semesters; // e.g. ["Sem 3", "Sem 5"]

// ─── Extract Keys ─────────────────────────────────────────────────────────────
export function getCoreKeys(sem) {
  if (!rawData.index[sem] || !rawData.index[sem].core) return [];
  return Object.values(rawData.index[sem].core).flat();
}

export function getPe1Keys(sem) {
  if (!rawData.index[sem] || !rawData.index[sem].pe1) return [];
  return Object.values(rawData.index[sem].pe1).flat();
}

export function getPe2Keys(sem) {
  if (!rawData.index[sem] || !rawData.index[sem].pe2) return [];
  return Object.values(rawData.index[sem].pe2).flat();
}

// ─── Human-readable labels ────────────────────────────────────────────────────

/** Map an internal group key to a user-facing display label */
export function groupLabel(key) {
  if (!key) return '';
  const parts = key.split('__');
  return parts.length > 1 ? parts[1] : key;
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
  if (!key) return '';
  const prefix = key.split('-')[0];
  return PE_FULL_NAMES[prefix] ?? prefix;
}

// ─── Schedule merging ─────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/**
 * Build a combined weekly schedule from three group keys.
 */
export function buildCombinedSchedule(coreKey, pe1Key, pe2Key) {
  const combined = {};

  for (const day of DAYS) {
    const slots = [];

    const addSlots = (key, source) => {
      if (!key) return;
      const sectionData = rawData.sections[key];
      if (!sectionData || !sectionData.days || !sectionData.days[day]) return;
      
      const dayData = sectionData.days[day];
      dayData.forEach(slot => {
        const match = slot.period.match(/^(P\d+)\s*\(([^)]+)\)/);
        const periodName = match ? match[1] : slot.period;
        const timeStr = match ? match[2].split('-')[0].trim() : '';

        slots.push({
          period: periodName,
          time: convertTo24Hour(timeStr),
          subject: slot.course,
          faculty: slot.faculty,
          room: slot.room,
          source: source,
          type: slot.type
        });
      });
    };

    addSlots(coreKey, 'core');
    addSlots(pe1Key,  'pe1');
    addSlots(pe2Key,  'pe2');

    // Sort by period number
    slots.sort((a, b) => {
      const numA = parseInt(a.period.replace('P', ''), 10) || 0;
      const numB = parseInt(b.period.replace('P', ''), 10) || 0;
      return numA - numB;
    });

    combined[day] = slots;
  }

  return combined;
}

function convertTo24Hour(time12h) {
  if (!time12h) return '';
  const match = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return time12h;
  let [ , h, m, modifier ] = match;
  h = parseInt(h, 10);
  if (modifier.toUpperCase() === 'PM' && h < 12) h += 12;
  if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${m}`;
}

/**
 * Format a period time string (24h "HH:MM") to "H:MM AM/PM"
 */
export function formatTime(time24) {
  if (!time24) return '';
  if (time24.includes('AM') || time24.includes('PM')) return time24;
  const [h, m] = time24.split(':').map(Number);
  if (isNaN(h)) return time24;
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
