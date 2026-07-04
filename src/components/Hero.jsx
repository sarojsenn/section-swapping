import { motion } from 'framer-motion';
import { FiArrowDown, FiArrowRight } from 'react-icons/fi';
import Gallery3D from './Gallery3D';

export default function Hero() {
  const handleScroll = () => {
    const el = document.querySelector('#post-request');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 bg-transparent">

      {/* Subtle background dot pattern in soft green */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 py-16">

        {/* LEFT */}
        <div className="flex-1 max-w-xl text-center lg:text-left">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-3 max-w-2xl px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 mb-6"
          >
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-semibold">Notice:</span> KSwapFinder is only a platform
              to help students find mutual section swaps. We do <strong> not </strong>
              encourage, promote, or support exchanging money or any other form of
              payment for section swaps.
            </p>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 leading-[1.05]"
          >
            Find your<br />
            <span className="text-emerald-600 dark:text-emerald-400">perfect swap</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
          >
            Post your current section, pick what you want, and get matched with students who have exactly what you need.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3"
          >
            <button
              id="hero-post-cta"
              onClick={handleScroll}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors duration-150 shadow-sm"
            >
              Post a Request <FiArrowRight size={15} />
            </button>
            <button
              onClick={() => document.querySelector('#community-board')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
            >
              Browse Board
            </button>
          </motion.div>

          {/* Small feature row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center justify-center lg:justify-start gap-6 mt-8"
          >
            {[
              { label: 'Instant matching' },
              { label: 'Free to use' },
              { label: 'No sign-up needed' },
            ].map(f => (
              <span key={f.label} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {f.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Gallery */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 flex items-center justify-center w-full"
        >
          <Gallery3D />
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.button
        onClick={handleScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-full border border-gray-200 dark:border-white/10 text-gray-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors duration-150"
        aria-label="Scroll down"
      >
        <FiArrowDown size={17} />
      </motion.button>
    </section>
  );
}
