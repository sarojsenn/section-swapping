import { motion } from 'framer-motion';
import { FiArrowDown, FiArrowRight, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Gallery3D from './Gallery3D';

export default function Hero() {
  const handleScroll = () => {
    // If we want to scroll on the same page, but now it's on different pages.
    // The arrow can just point down if there's content below, but on Landing page there isn't.
    // So we can remove the down arrow or link it to something else.
  };

  return (
    <section id="hero" className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden bg-transparent">

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
            className="flex items-start gap-3 max-w-2xl px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 mb-6 text-left"
          >
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-semibold">Notice:</span> KMate is only a platform
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
            Find your swap<br />
            <span className="text-emerald-600 dark:text-emerald-400">& schedule classes</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
          >
            Post your current section, pick what you want, get matched with students instantly, and manage your 5th-semester timetable all in one place.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3"
          >
            <Link
              to="/swap"
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors duration-150 shadow-sm"
            >
              Go to Swap Board <FiArrowRight size={15} />
            </Link>
            <Link
              to="/timetable"
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150"
            >
              <FiCalendar size={15} /> View Timetable
            </Link>
          </motion.div>

          {/* Small feature row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 mt-8"
          >
            {[
              { label: 'Instant matching' },
              { label: 'Free to use' },
              { label: 'Secure KIIT Login' },
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
    </section>
  );
}
