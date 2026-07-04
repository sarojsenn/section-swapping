import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiTrash2 } from 'react-icons/fi';
import { useSwap } from '../context/SwapContext';

const SEMESTERS = ['3rd', '5th'];

const defaultForm = {
  name: '',
  rollNumber: '',
  semester: '',
  currentSection: '',
  wantedSections: [],
  contact: '',
  note: '',
};

export default function PostRequestForm() {
  const { addRequest } = useSwap();
  const [form, setForm] = useState(defaultForm);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const tagRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    if (!form.semester) e.semester = 'Please select a semester';
    if (!form.currentSection.trim()) e.currentSection = 'Current section is required';
    if (form.wantedSections.length === 0) e.wantedSections = 'Add at least one wanted section';
    if (!form.contact.trim()) e.contact = 'Contact info is required';
    return e;
  };

  const handleAddTag = useCallback(() => {
    const val = tagInput.trim();
    if (!val) return;
    if (form.wantedSections.includes(val)) { setTagInput(''); return; }
    setForm(prev => ({ ...prev, wantedSections: [...prev.wantedSections, val] }));
    setTagInput('');
    if (errors.wantedSections) setErrors(prev => ({ ...prev, wantedSections: '' }));
  }, [tagInput, form.wantedSections, errors.wantedSections]);

  const handleRemoveTag = (tag) => {
    setForm(prev => ({ ...prev, wantedSections: prev.wantedSections.filter(t => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag(); }
    if (e.key === 'Backspace' && tagInput === '' && form.wantedSections.length > 0) {
      setForm(prev => ({ ...prev, wantedSections: prev.wantedSections.slice(0, -1) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const insertedId = await addRequest(form);
    if (!insertedId) { setErrors({ submit: 'Unable to post right now. Try again.' }); return; }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(defaultForm); setTagInput(''); setErrors({});
    setTimeout(() => document.querySelector('#community-board')?.scrollIntoView({ behavior: 'smooth' }), 400);
  };

  const handleClear = () => { setForm(defaultForm); setTagInput(''); setErrors({}); };

  const input = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors duration-150 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none ${hasError ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-white/10'}`;

  return (
    <section id="post-request" className="py-20 px-4 sm:px-6 bg-transparent">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Step 1
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Post a swap request
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Fill in your details and we'll automatically match you with compatible students.
          </p>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-5 p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 flex items-center gap-3"
            >
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400 text-sm">Request posted!</p>
                <p className="text-green-600 dark:text-green-500 text-xs mt-0.5">Now live on the community board.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {errors.submit && (
          <div className="mb-5 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">

              {/* Name & Roll */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input id="name" type="text" placeholder="e.g. Saroj Sen" value={form.name}
                    onChange={e => { setForm(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
                    className={input(!!errors.name)} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="roll-number">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input id="roll-number" type="text" placeholder="e.g. 2405XXXX" value={form.rollNumber}
                    onChange={e => { setForm(p => ({ ...p, rollNumber: e.target.value })); if (errors.rollNumber) setErrors(p => ({ ...p, rollNumber: '' })); }}
                    className={input(!!errors.rollNumber)} />
                  {errors.rollNumber && <p className="mt-1 text-xs text-red-500">{errors.rollNumber}</p>}
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Semester <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {SEMESTERS.map(sem => (
                    <button key={sem} type="button" id={`semester-${sem}`}
                      onClick={() => { setForm(p => ({ ...p, semester: sem })); if (errors.semester) setErrors(p => ({ ...p, semester: '' })); }}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors duration-150 ${form.semester === sem
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-500/40 bg-white dark:bg-[#1a1a1a]'
                      }`}
                    >
                      {sem} Semester
                    </button>
                  ))}
                </div>
                {errors.semester && <p className="mt-1 text-xs text-red-500">{errors.semester}</p>}
              </div>

              {/* Current Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="current-section">
                  Current Section <span className="text-red-500">*</span>
                </label>
                <input id="current-section" type="text" placeholder="e.g. CSE34 or 34" value={form.currentSection}
                  onChange={e => { setForm(p => ({ ...p, currentSection: e.target.value })); if (errors.currentSection) setErrors(p => ({ ...p, currentSection: '' })); }}
                  className={input(!!errors.currentSection)} />
                {errors.currentSection && <p className="mt-1 text-xs text-red-500">{errors.currentSection}</p>}
              </div>

              {/* Wanted Sections */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Sections You'd Accept <span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex flex-wrap gap-2 px-3 py-2.5 min-h-[48px] rounded-lg border cursor-text transition-colors duration-150 bg-white dark:bg-[#1a1a1a] ${errors.wantedSections ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-white/10'}`}
                  onClick={() => tagRef.current?.focus()}
                >
                  <AnimatePresence>
                    {form.wantedSections.map(tag => (
                      <motion.span key={tag} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/30"
                      >
                        {tag}
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }} className="text-emerald-400 hover:text-emerald-600 transition-colors">
                          <FiX size={11} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input ref={tagRef} id="wanted-sections-input" type="text"
                    placeholder={form.wantedSections.length === 0 ? 'Type section and press Enter (e.g. 12)' : 'Add more...'}
                    value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} onBlur={handleAddTag}
                    className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Press Enter or comma after each section.</p>
                {errors.wantedSections && <p className="mt-1 text-xs text-red-500">{errors.wantedSections}</p>}
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="contact-info">
                  Contact Info <span className="text-red-500">*</span>
                </label>
                <input id="contact-info" type="text" placeholder="Email / Phone / WhatsApp / Telegram" value={form.contact}
                  onChange={e => { setForm(p => ({ ...p, contact: e.target.value })); if (errors.contact) setErrors(p => ({ ...p, contact: '' })); }}
                  className={input(!!errors.contact)} />
                {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="optional-note">
                  Note <span className="text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <textarea id="optional-note" rows={3} placeholder="Any preferences or extra info..."
                  value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  className={`${input(false)} resize-none`} />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button type="submit" id="post-request-btn"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors duration-150 shadow-sm"
                >
                  <FiSend size={15} /> Post Request
                </button>
                <button type="button" id="clear-form-btn" onClick={handleClear}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
                >
                  <FiTrash2 size={15} /> Clear
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
