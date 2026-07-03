import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiSend, FiTrash2 } from 'react-icons/fi';
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
    if (form.wantedSections.includes(val)) {
      setTagInput('');
      return;
    }
    setForm(prev => ({ ...prev, wantedSections: [...prev.wantedSections, val] }));
    setTagInput('');
    if (errors.wantedSections) setErrors(prev => ({ ...prev, wantedSections: '' }));
  }, [tagInput, form.wantedSections, errors.wantedSections]);

  const handleRemoveTag = (tag) => {
    setForm(prev => ({ ...prev, wantedSections: prev.wantedSections.filter(t => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
    if (e.key === 'Backspace' && tagInput === '' && form.wantedSections.length > 0) {
      setForm(prev => ({ ...prev, wantedSections: prev.wantedSections.slice(0, -1) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const insertedId = await addRequest(form);
    if (!insertedId) {
      setErrors({ submit: 'Unable to post request right now. Please try again.' });
      return;
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(defaultForm);
    setTagInput('');
    setErrors({});
    setTimeout(() => {
      document.querySelector('#community-board')?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  const handleClear = () => {
    setForm(defaultForm);
    setTagInput('');
    setErrors({});
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none';

  const errorBorder = 'border-rose-400 dark:border-rose-500';
  const normalBorder = 'border-gray-200 dark:border-white/10';

  return (
    <section id="post-request" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-4">
            Step 1
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Post a swap request
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Fill in your details and we&apos;ll automatically match you with compatible students.
          </p>
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3"
            >
              <span className="text-emerald-500 text-xl">🎉</span>
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
                  Request posted successfully!
                </p>
                <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-0.5">
                  Your request is now live on the community board.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {errors.submit && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-200 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-[#161620] border border-gray-100 dark:border-white/5 rounded-2xl shadow-xl shadow-gray-100/50 dark:shadow-black/30 p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              {/* Name & Roll */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="name">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Saroj Sen"
                    value={form.name}
                    onChange={e => {
                      setForm(p => ({ ...p, name: e.target.value }));
                      if (errors.name) setErrors(p => ({ ...p, name: '' }));
                    }}
                    className={`${inputBase} ${errors.name ? errorBorder : normalBorder}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="roll-number">
                    Roll Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="roll-number"
                    type="text"
                    placeholder="e.g. 22051234"
                    value={form.rollNumber}
                    onChange={e => {
                      setForm(p => ({ ...p, rollNumber: e.target.value }));
                      if (errors.rollNumber) setErrors(p => ({ ...p, rollNumber: '' }));
                    }}
                    className={`${inputBase} ${errors.rollNumber ? errorBorder : normalBorder}`}
                  />
                  {errors.rollNumber && <p className="mt-1 text-xs text-rose-500">{errors.rollNumber}</p>}
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Semester <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-3">
                  {SEMESTERS.map(sem => (
                    <button
                      key={sem}
                      type="button"
                      id={`semester-${sem}`}
                      onClick={() => {
                        setForm(p => ({ ...p, semester: sem }));
                        if (errors.semester) setErrors(p => ({ ...p, semester: '' }));
                      }}
                      className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                        form.semester === sem
                          ? sem === '3rd'
                            ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20 bg-gray-50 dark:bg-white/5'
                      }`}
                    >
                      {sem} Semester
                    </button>
                  ))}
                </div>
                {errors.semester && <p className="mt-1 text-xs text-rose-500">{errors.semester}</p>}
              </div>

              {/* Current Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="current-section">
                  Current Section <span className="text-rose-500">*</span>
                </label>
                <input
                  id="current-section"
                  type="text"
                  placeholder="e.g. 34"
                  value={form.currentSection}
                  onChange={e => {
                    setForm(p => ({ ...p, currentSection: e.target.value }));
                    if (errors.currentSection) setErrors(p => ({ ...p, currentSection: '' }));
                  }}
                  className={`${inputBase} ${errors.currentSection ? errorBorder : normalBorder}`}
                />
                {errors.currentSection && <p className="mt-1 text-xs text-rose-500">{errors.currentSection}</p>}
              </div>


              {/* Wanted Sections */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Wanted Sections <span className="text-rose-500">*</span>
                </label>
                <div
                  className={`flex flex-wrap gap-2 px-3 py-2.5 min-h-[52px] rounded-xl border cursor-text transition-all duration-200 bg-gray-50 dark:bg-white/5 ${
                    errors.wantedSections ? errorBorder : normalBorder
                  }`}
                  onClick={() => tagRef.current?.focus()}
                >
                  <AnimatePresence>
                    {form.wantedSections.map(tag => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold border border-emerald-200 dark:border-emerald-500/30"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }}
                          className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                          aria-label={`Remove section ${tag}`}
                        >
                          <FiX size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input
                    ref={tagRef}
                    id="wanted-sections-input"
                    type="text"
                    placeholder={form.wantedSections.length === 0 ? 'Type a section number and press Enter (e.g. 12)' : 'Add more...'}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={handleAddTag}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-600">Press Enter or comma to add a section tag.</p>
                {errors.wantedSections && <p className="mt-1 text-xs text-rose-500">{errors.wantedSections}</p>}
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="contact-info">
                  Contact Information <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-info"
                  type="text"
                  placeholder="Email / Phone / Telegram / WhatsApp"
                  value={form.contact}
                  onChange={e => {
                    setForm(p => ({ ...p, contact: e.target.value }));
                    if (errors.contact) setErrors(p => ({ ...p, contact: '' }));
                  }}
                  className={`${inputBase} ${errors.contact ? errorBorder : normalBorder}`}
                />
                {errors.contact && <p className="mt-1 text-xs text-rose-500">{errors.contact}</p>}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="optional-note">
                  Optional Note
                </label>
                <textarea
                  id="optional-note"
                  rows={3}
                  placeholder="Any additional info or preferences..."
                  value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  className={`${inputBase} resize-none ${normalBorder}`}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  id="post-request-btn"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <FiSend size={16} />
                  Post Request
                </button>
                <button
                  type="button"
                  id="clear-form-btn"
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <FiTrash2 size={16} />
                  Clear
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
